import { ASTBlock, ASTNode, pugParse } from './pug-parser';
import {
	MLASTDoctype,
	MLASTNode,
	MLASTNodeType,
	MLASTParentNode,
	MLASTPreprocessorSpecificBlock,
	MLASTTag,
	Parse,
} from '@markuplint/ml-ast';
import { getNamespace, parse as htmlParser, isDocumentFragment, removeDeprecatedNode } from '@markuplint/html-parser';
import { ignoreFrontMatter, isPotentialCustomElementName, tokenizer, uuid, walk } from '@markuplint/parser-utils';
import attrTokenizer from './attr-tokenizer';

export const parse: Parse = (rawCode, _, __, ___, isIgnoringFrontMatter) => {
	let parseError: string | undefined;
	let nodeList: MLASTNode[];

	if (isIgnoringFrontMatter) {
		rawCode = ignoreFrontMatter(rawCode);
	}

	try {
		const parser = new Parser(rawCode);
		nodeList = parser.getNodeList();
	} catch (err) {
		nodeList = [];
		if (err instanceof Error) {
			parseError = err.message;
		} else {
			parseError = 'Unknown Error';
		}
	}

	return {
		nodeList,
		isFragment: isDocumentFragment(rawCode),
		parseError,
	};
};

class Parser {
	#ast: ASTBlock;

	constructor(raw: string) {
		this.#ast = pugParse(raw);
		// console.log(JSON.stringify(this.#ast, null, 2));
	}

	getNodeList() {
		const nodeTree = this.traverse(this.#ast.nodes, null);
		return this.flattenNodes(nodeTree);
	}

	traverse(astNodes: ASTNode[], parentNode: MLASTParentNode | null = null): MLASTNode[] {
		const nodeList: MLASTNode[] = [];

		let prevNode: MLASTNode | null = null;
		for (const astNode of astNodes) {
			const nodes = this.nodeize(astNode, prevNode, parentNode);
			if (!nodes || (Array.isArray(nodes) && nodes.length === 0)) {
				continue;
			}

			let node: MLASTNode;
			if (Array.isArray(nodes)) {
				node = nodes[nodes.length - 1];
			} else {
				node = nodes;
			}

			if (prevNode) {
				if (node.type !== MLASTNodeType.EndTag) {
					prevNode.nextNode = node;
				}
				node.prevNode = prevNode;
			}
			prevNode = node;

			if (Array.isArray(nodes)) {
				nodeList.push(...nodes);
			} else {
				nodeList.push(nodes);
			}
		}

		return nodeList;
	}

	nodeize(
		originNode: ASTNode,
		prevNode: MLASTNode | null,
		parentNode: MLASTParentNode | null,
	): MLASTNode | MLASTNode[] | null {
		const nextNode = null;
		const startOffset = originNode.offset;
		const endOffset = originNode.endOffset;
		const startLine = originNode.line;
		const endLine = originNode.endLine;
		const startCol = originNode.column;
		const endCol = originNode.endColumn;
		const parentNamespace =
			parentNode && 'namespace' in parentNode ? parentNode.namespace : 'http://www.w3.org/1999/xhtml';

		switch (originNode.type) {
			case 'Doctype': {
				return {
					uuid: uuid(),
					raw: originNode.raw,
					name: originNode.val || '',
					// TODO:
					publicId: '',
					// TODO:
					systemId: '',
					startOffset,
					endOffset,
					startLine,
					endLine,
					startCol,
					endCol,
					nodeName: '#doctype',
					type: MLASTNodeType.Doctype,
					parentNode,
					prevNode,
					_addPrevNode: 102,
					nextNode,
					isFragment: false,
					isGhost: false,
				} as MLASTDoctype;
			}
			case 'Text': {
				if (parentNode && /^script$|^style$/i.test(parentNode.nodeName)) {
					return {
						uuid: uuid(),
						raw: originNode.raw,
						startOffset,
						endOffset,
						startLine,
						endLine,
						startCol,
						endCol,
						nodeName: '#text',
						type: MLASTNodeType.Text,
						parentNode,
						prevNode,
						nextNode,
						isFragment: false,
						isGhost: false,
					};
				}
				const htmlDoc = htmlParser(
					originNode.raw,
					originNode.offset,
					originNode.line - 1,
					originNode.column - 1,
				);
				const nodes = htmlDoc.nodeList;
				for (const node of nodes) {
					if (!node.parentNode) {
						node.parentNode = parentNode;
					}
				}
				return nodes;
			}
			case 'Comment': {
				return {
					uuid: uuid(),
					raw: originNode.raw,
					startOffset,
					endOffset,
					startLine,
					endLine,
					startCol,
					endCol,
					nodeName: '#comment',
					type: MLASTNodeType.Comment,
					parentNode,
					prevNode,
					nextNode,
					isFragment: false,
					isGhost: false,
				};
			}
			case 'Tag': {
				const namespace = getNamespace(originNode.name, parentNamespace);
				const tag: MLASTTag = {
					uuid: uuid(),
					raw: originNode.raw,
					startOffset,
					endOffset,
					startLine,
					endLine,
					startCol,
					endCol,
					nodeName: originNode.name,
					type: MLASTNodeType.StartTag,
					namespace,
					attributes: originNode.attrs.map(attr => attrTokenizer(attr)),
					hasSpreadAttr: false,
					parentNode,
					prevNode,
					nextNode,
					pearNode: null,
					selfClosingSolidus: tokenizer('', originNode.line, originNode.column, originNode.offset),
					endSpace: tokenizer('', originNode.line, originNode.column, originNode.offset),
					isFragment: false,
					isGhost: false,
					tagOpenChar: '',
					tagCloseChar: '',
					isCustomElement: isPotentialCustomElementName(originNode.name),
				};

				if (originNode.block.nodes.length) {
					tag.childNodes = this.traverse(originNode.block.nodes, tag);
				}

				return tag;
			}
			default: {
				const tag: MLASTPreprocessorSpecificBlock = {
					uuid: uuid(),
					raw: originNode.raw,
					startOffset,
					endOffset,
					startLine,
					endLine,
					startCol,
					endCol,
					type: MLASTNodeType.PreprocessorSpecificBlock,
					nodeName: originNode.type,
					parentNode,
					prevNode,
					nextNode,
					isFragment: true,
					isGhost: false,
				};

				if ('block' in originNode && originNode.block?.nodes.length) {
					tag.childNodes = this.traverse(originNode.block.nodes, tag);
				}

				return tag;
			}
		}
	}

	flattenNodes(nodeTree: MLASTNode[]) {
		const nodeOrders: MLASTNode[] = [];
		walk(nodeTree, node => {
			nodeOrders.push(node);
		});

		removeDeprecatedNode(nodeOrders);

		return nodeOrders;
	}
}
