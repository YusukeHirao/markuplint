// @ts-ignore
import { SyntaxError as _SyntaxError, parse as _parse } from './_tokenizer';

export type Grammer = Datatypes | Namespace | Include | Define;

export type Required = 'zeroOrMore' | 'oneOrMore' | 'optional';

export type Datatypes = {
	type: 'datatypes';
	name: string;
	value: string;
};

export type Namespace = {
	type: 'namespace';
	name: string | null;
	value: string;
	isDefault: boolean;
};

export type Include = {
	type: 'include';
	filePath: string;
	override?: Grammer[];
};

export type Define = {
	type: 'define';
	name: 'a';
	contents?: Expression[];
	choice?: Expression[];
	interleave?: Expression[];
};

export type Expression = Ref | ExpressionGroup | ExpressionChoice | ExpressionInterleave;

export type Ref = {
	type: 'ref';
	name: string;
	ns?: string;
	required?: Required;
};

export type ExpressionGroup = {
	type: 'group';
	contents: Expression[];
	required?: Required;
};

export type ExpressionChoice = {
	choice: Expression[];
};

export type ExpressionInterleave = {
	interleave: Expression[];
};

export type Element = {
	type: 'element';
	name: string;
	without?: string;
	contents: Expression[];
};

export type Attribute = {
	type: 'attribute';
	name: string;
	values: AttrValues;
};

export type AttrValues = AttrRefs | AttrValueGroup;

export type AttrValueGroup = {
	type: 'group';
	contents: AttrRefs;
	required?: Required;
};

export type AttrRefs = AttrRefsAnd | AttrRefsOr | AttrRef;

export type AttrRefsOr = {
	choice: AttrRef[];
};

export type AttrRefsAnd = {
	interleave: AttrRef[];
};

export type AttrRef = AttrValueGroup | List | Data | Ref | Keyword | StringValue;

export type Keyword = {
	type: 'keyword';
	name: 'empty' | 'notAllowed' | 'text' | 'token';
};

export type List = {
	type: 'list';
	items: AttrValues & {
		required?: Required;
	};
};

export type StringValue = {
	type: 'string' | 'token';
	ns?: string;
	value: string;
	required?: Required;
};

export type Data = {
	type: string;
	ns?: string;
	params: { [prop: string]: string };
};

export interface ISyntaxError {}

interface ParseFunction {
	(input: string, options?: any): Grammer[];
}

export const SyntaxError: ISyntaxError = _SyntaxError;
export const parse: ParseFunction = _parse;
