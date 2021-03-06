import { JSXNode, getAttr, getName } from './jsx';
import {
	MLASTElementCloseTag,
	MLASTNode,
	MLASTNodeType,
	MLASTParentNode,
	MLASTTag,
	MLASTText,
} from '@markuplint/ml-ast';
import { getNamespace, parseRawTag } from '@markuplint/html-parser';
import { isPotentialCustomElementName, sliceFragment, uuid } from '@markuplint/parser-utils';
import { attr } from './attr';
import { traverse } from './traverse';

export function nodeize(
	originNode: JSXNode,
	prevNode: MLASTNode | null,
	parentNode: MLASTParentNode | null,
	rawHtml: string,
): MLASTNode | MLASTNode[] | null {
	const nextNode = null;
	const parentNamespace =
		parentNode && 'namespace' in parentNode ? parentNode.namespace : 'http://www.w3.org/1999/xhtml';

	switch (originNode.type) {
		case 'JSXText': {
			const { startOffset, endOffset, startLine, endLine, startCol, endCol, raw } = sliceFragment(
				rawHtml,
				originNode.range[0],
				originNode.range[1],
			);
			const node: MLASTText = {
				uuid: uuid(),
				raw,
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
			return node;
		}
		case 'JSXElement': {
			const startTagLocation = sliceFragment(
				rawHtml,
				originNode.openingElement.range[0],
				originNode.openingElement.range[1],
			);

			let endTag: MLASTElementCloseTag | null = null;
			if (originNode.closingElement) {
				const endTagLocation = sliceFragment(
					rawHtml,
					originNode.closingElement.range[0],
					originNode.closingElement.range[1],
				);
				const endTagRaw = endTagLocation.raw;
				const endTagStartOffset = endTagLocation.startOffset;
				const endTagEndOffset = endTagLocation.endOffset;
				const nodeName = getName(originNode.closingElement.name);
				const namespace = getNamespace(nodeName, parentNamespace);
				endTag = {
					uuid: uuid(),
					raw: endTagRaw,
					startOffset: endTagStartOffset,
					endOffset: endTagEndOffset,
					startLine: endTagLocation.startLine,
					endLine: endTagLocation.endLine,
					startCol: endTagLocation.startCol,
					endCol: endTagLocation.endCol,
					nodeName,
					type: MLASTNodeType.EndTag,
					namespace,
					attributes: [],
					parentNode,
					prevNode,
					nextNode,
					pearNode: null,
					isFragment: false,
					isGhost: false,
					tagOpenChar: '</',
					tagCloseChar: '>',
					isCustomElement: isJSXComponentName(nodeName),
				};
			}

			const { attrs /*hasSpreadAttr*/ } = getAttr(originNode.openingElement.attributes);
			const tagTokens = parseRawTag(
				startTagLocation.raw,
				startTagLocation.startLine,
				startTagLocation.startCol,
				startTagLocation.startOffset,
			);
			const nodeName = getName(originNode.openingElement.name);
			const namespace = getNamespace(nodeName, parentNamespace);

			const hasSpreadAttr = '__hasSpreadAttribute' in originNode;

			const startTag: MLASTTag = {
				uuid: uuid(),
				...startTagLocation,
				nodeName,
				type: MLASTNodeType.StartTag,
				namespace,
				attributes: attrs.map(a => attr(a, rawHtml)),
				hasSpreadAttr,
				parentNode,
				prevNode,
				nextNode,
				pearNode: endTag,
				selfClosingSolidus: tagTokens.selfClosingSolidus,
				endSpace: tagTokens.endSpace,
				// hasSpreadAttr,
				isFragment: false,
				isGhost: false,
				tagOpenChar: '<',
				tagCloseChar: '>',
				isCustomElement: isJSXComponentName(nodeName),
			};
			if (endTag) {
				endTag.pearNode = startTag;
			}

			if (originNode.children) {
				startTag.childNodes = traverse(originNode.children, startTag, rawHtml);
			}

			return startTag;
		}
		case 'JSXFragment': {
			const startTagLocation = sliceFragment(
				rawHtml,
				originNode.openingFragment.range[0],
				originNode.openingFragment.range[1],
			);

			let endTag: MLASTElementCloseTag | null = null;
			if (originNode.closingFragment) {
				const endTagLocation = sliceFragment(
					rawHtml,
					originNode.closingFragment.range[0],
					originNode.closingFragment.range[1],
				);
				const endTagRaw = endTagLocation.raw;
				const endTagStartOffset = endTagLocation.startOffset;
				const endTagEndOffset = endTagLocation.endOffset;
				endTag = {
					uuid: uuid(),
					raw: endTagRaw,
					startOffset: endTagStartOffset,
					endOffset: endTagEndOffset,
					startLine: endTagLocation.startLine,
					endLine: endTagLocation.endLine,
					startCol: endTagLocation.startCol,
					endCol: endTagLocation.endCol,
					nodeName: '#jsx-fragment',
					type: MLASTNodeType.EndTag,
					namespace: parentNamespace,
					attributes: [],
					parentNode,
					prevNode,
					nextNode,
					pearNode: null,
					isFragment: false,
					isGhost: false,
					tagOpenChar: '</',
					tagCloseChar: '>',
					isCustomElement: true,
				};
			}

			const startTag: MLASTTag = {
				uuid: uuid(),
				...startTagLocation,
				nodeName: '#jsx-fragment',
				type: MLASTNodeType.StartTag,
				namespace: parentNamespace,
				attributes: [],
				hasSpreadAttr: false,
				parentNode,
				prevNode,
				nextNode,
				pearNode: endTag,
				// hasSpreadAttr,
				isFragment: false,
				isGhost: false,
				tagOpenChar: '<',
				tagCloseChar: '>',
				isCustomElement: true,
			};
			if (endTag) {
				endTag.pearNode = startTag;
			}

			if (originNode.children) {
				startTag.childNodes = traverse(originNode.children, startTag, rawHtml);
			}

			return startTag;
		}
		default: {
			const { startOffset, endOffset, startLine, endLine, startCol, endCol, raw } = sliceFragment(
				rawHtml,
				originNode.range[0],
				originNode.range[1],
			);
			return {
				uuid: uuid(),
				raw,
				startOffset,
				endOffset,
				startLine,
				endLine,
				startCol,
				endCol,
				nodeName: originNode.type,
				type: MLASTNodeType.PreprocessorSpecificBlock,
				parentNode,
				prevNode,
				nextNode,
				isFragment: false,
				isGhost: false,
			};
		}
	}
}

function isJSXComponentName(name: string) {
	return isPotentialCustomElementName(name) || /[A-Z]|\./.test(name);
}
