import { JSXAttribute, getAttrName } from './jsx';
import { attrs, invalidAttrs } from './attr-dictionary';
import { sliceFragment, tokenizer, uuid } from '@markuplint/parser-utils';
import { MLASTAttr } from '@markuplint/ml-ast';
import { attrTokenizer } from '@markuplint/html-parser';

export function attr(attr: JSXAttribute, rawHTML: string): MLASTAttr {
	const beforeHtml = rawHTML.substr(0, attr.range[0]);
	const spacesBeforeNameStr = (beforeHtml.match(/\s+$/) || [''])[0];
	const startOffset = attr.range[0] - spacesBeforeNameStr.length;
	const endOffset = attr.range[1];
	const attrLoc = sliceFragment(rawHTML, startOffset, endOffset);

	let ast: MLASTAttr;
	if (attr.value === null || attr.value.type === 'Literal') {
		ast = attrTokenizer(attrLoc.raw, attrLoc.startLine, attrLoc.startCol, attrLoc.startOffset);
	} else {
		const spacesBeforeNameLine = attr.loc.start.line - (spacesBeforeNameStr.match(/\n/g) || []).length;
		const spacesBeforeNameLastBreakIndex = spacesBeforeNameStr.lastIndexOf('\n');
		const spacesBeforeNameColumn =
			spacesBeforeNameLastBreakIndex === -1
				? attr.loc.start.column
				: attr.loc.start.column - spacesBeforeNameStr.slice(spacesBeforeNameLastBreakIndex + 1).length;
		const spacesBeforeNameOffset = attr.range[0] - spacesBeforeNameStr.length;
		const spacesBeforeName = tokenizer(
			spacesBeforeNameStr,
			spacesBeforeNameLine,
			spacesBeforeNameColumn,
			spacesBeforeNameOffset,
		);
		const name = tokenizer(
			getAttrName(attr.name),
			spacesBeforeName.endLine,
			spacesBeforeName.endCol,
			spacesBeforeName.endOffset,
		);
		const spacesBeforeEqual = tokenizer('', name.endLine, name.endCol, name.endOffset);
		const equal = tokenizer('=', spacesBeforeEqual.endLine, spacesBeforeEqual.endCol, spacesBeforeEqual.endOffset);
		const spacesAfterEqual = tokenizer('', equal.endLine, equal.endCol, equal.endOffset);
		const startQuote = tokenizer('', spacesAfterEqual.endLine, spacesAfterEqual.endCol, spacesAfterEqual.endOffset);
		const rawValue = sliceFragment(rawHTML, attr.value.range[0], attr.value.range[1]);
		const value = tokenizer(rawValue.raw, rawValue.startLine, rawValue.startCol, rawValue.startOffset);
		const endQuote = tokenizer(null, value.endLine, value.endCol, value.endOffset);
		ast = {
			uuid: uuid(),
			...attrLoc,
			type: 'html-attr',
			spacesBeforeName,
			name,
			spacesBeforeEqual,
			equal,
			spacesAfterEqual,
			startQuote,
			value,
			endQuote,
			isInvalid: false,
			isDynamicValue: true,
			isDuplicatable: false,
		};
	}

	const rawName = ast.name.raw;

	switch (rawName) {
		case 'className':
			ast.potentialName = 'class';
			break;
		case 'htmlFor':
			ast.potentialName = 'for';
			break;
		default:
			if (
				// JSX Supporting attributes
				attrs.includes(rawName) ||
				// Event attributes
				/^on[a-z]/i.test(rawName)
			) {
				ast.potentialName = rawName.toLowerCase();
			}
	}

	if (invalidAttrs.includes(rawName)) {
		ast.isInvalid = true;
		const candidate = attrs.find(attr => attr.toLowerCase() === rawName);
		if (candidate) {
			ast.candidate = candidate;
		}
	}

	return ast;
}
