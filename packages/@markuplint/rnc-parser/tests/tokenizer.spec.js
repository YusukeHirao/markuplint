/* eslint-disable @typescript-eslint/no-var-requires */
const { parse } = require('../lib/_tokenizer');

describe('Datatypes', () => {
	it('is datatypes', () => {
		expect(parse('datatypes w = "http://whattf.org/datatype-draft"')[0]).toStrictEqual({
			type: 'datatypes',
			name: 'w',
			value: 'http://whattf.org/datatype-draft',
		});
	});
});

describe('Namespace', () => {
	it('is default namespace', () => {
		expect(parse('default namespace = "http://www.w3.org/1999/xhtml"')[0]).toStrictEqual({
			type: 'namespace',
			name: null,
			value: 'http://www.w3.org/1999/xhtml',
			isDefault: true,
		});
	});

	it('is namespace', () => {
		expect(parse('namespace svg = "http://www.w3.org/2000/svg"')[0]).toStrictEqual({
			type: 'namespace',
			name: 'svg',
			value: 'http://www.w3.org/2000/svg',
			isDefault: false,
		});
	});
});

describe('Includeing', () => {
	it('is include', () => {
		expect(parse('include "foo.rnc"')[0]).toStrictEqual({
			type: 'include',
			filePath: 'foo.rnc',
		});
	});

	it('is namespace', () => {
		expect(parse('include "bar.rnc" { a = b }')[0]).toStrictEqual({
			type: 'include',
			filePath: 'bar.rnc',
			override: [
				{
					type: 'define',
					name: 'a',
					contents: [
						{
							type: 'ref',
							name: 'b',
						},
					],
				},
			],
		});
	});
});

describe('Definition', () => {
	it('is definition', () => {
		expect(parse('a = a')[0]).toStrictEqual({
			type: 'define',
			name: 'a',
			contents: [
				{
					type: 'ref',
					name: 'a',
				},
			],
		});
	});

	it('is definition (choice)', () => {
		expect(parse('a |= a')[0]).toStrictEqual({
			type: 'define',
			name: 'a',
			choice: [
				{
					type: 'ref',
					name: 'a',
				},
			],
		});
	});

	it('is definition (interleave)', () => {
		expect(parse('a &= a')[0]).toStrictEqual({
			type: 'define',
			name: 'a',
			interleave: [
				{
					type: 'ref',
					name: 'a',
				},
			],
		});
	});
});

describe('Order', () => {
	it('is choice list', () => {
		expect(parse('a = a | b')[0]).toStrictEqual({
			type: 'define',
			name: 'a',
			contents: [
				{
					choice: [
						{
							type: 'ref',
							name: 'a',
						},
						{
							type: 'ref',
							name: 'b',
						},
					],
				},
			],
		});
	});

	it('is group choice list', () => {
		expect(parse('a = (a | b)')[0]).toStrictEqual({
			type: 'define',
			name: 'a',
			contents: [
				{
					type: 'group',
					contents: [
						{
							choice: [
								{
									type: 'ref',
									name: 'a',
								},
								{
									type: 'ref',
									name: 'b',
								},
							],
						},
					],
				},
			],
		});
	});

	it('is interleave list', () => {
		expect(parse('a = a & b & c')[0]).toStrictEqual({
			type: 'define',
			name: 'a',
			contents: [
				{
					interleave: [
						{
							type: 'ref',
							name: 'a',
						},
						{
							type: 'ref',
							name: 'b',
						},
						{
							type: 'ref',
							name: 'c',
						},
					],
				},
			],
		});
	});

	it('is list', () => {
		expect(parse('a = a , b , c')[0]).toStrictEqual({
			type: 'define',
			name: 'a',
			contents: [
				{
					type: 'ref',
					name: 'a',
				},
				{
					type: 'ref',
					name: 'b',
				},
				{
					type: 'ref',
					name: 'c',
				},
			],
		});
	});
});

describe('Grouping', () => {
	it('is deep nesting', () => {
		expect(parse('a = (b* & (c+ | d)?)')[0]).toStrictEqual({
			type: 'define',
			name: 'a',
			contents: [
				{
					type: 'group',
					contents: [
						{
							interleave: [
								{
									type: 'ref',
									name: 'b',
									required: 'zeroOrMore',
								},
								{
									type: 'group',
									contents: [
										{
											choice: [
												{
													type: 'ref',
													name: 'c',
													required: 'oneOrMore',
												},
												{
													type: 'ref',
													name: 'd',
												},
											],
										},
									],
									required: 'optional',
								},
							],
						},
					],
				},
			],
		});
	});

	it('is deep nesting', () => {
		expect(parse('a = (b?, c*, d*, c*, e?, c*, ((e* | f+), c*, g?))')[0]).toStrictEqual({
			type: 'define',
			name: 'a',
			contents: [
				{
					type: 'group',
					contents: [
						{
							type: 'ref',
							name: 'b',
							required: 'optional',
						},
						{
							type: 'ref',
							name: 'c',
							required: 'zeroOrMore',
						},
						{
							type: 'ref',
							name: 'd',
							required: 'zeroOrMore',
						},
						{
							type: 'ref',
							name: 'c',
							required: 'zeroOrMore',
						},
						{
							type: 'ref',
							name: 'e',
							required: 'optional',
						},
						{
							type: 'ref',
							name: 'c',
							required: 'zeroOrMore',
						},
						{
							type: 'group',
							contents: [
								{
									type: 'group',
									contents: [
										{
											choice: [
												{
													type: 'ref',
													name: 'e',
													required: 'zeroOrMore',
												},
												{
													type: 'ref',
													name: 'f',
													required: 'oneOrMore',
												},
											],
										},
									],
								},
								{
									type: 'ref',
									name: 'c',
									required: 'zeroOrMore',
								},
								{
									type: 'ref',
									name: 'g',
									required: 'optional',
								},
							],
						},
					],
				},
			],
		});
	});
});

describe('Element', () => {
	it('is Element (content empty)', () => {
		expect(parse('a = element a {}')[0]).toStrictEqual({
			type: 'define',
			name: 'a',
			contents: [
				{
					type: 'element',
					name: 'a',
					contents: null,
				},
			],
		});
	});

	it('is Element', () => {
		expect(parse('a = element a { sub }')[0]).toStrictEqual({
			type: 'define',
			name: 'a',
			contents: [
				{
					type: 'element',
					name: 'a',
					contents: [
						{
							type: 'ref',
							name: 'sub',
						},
					],
				},
			],
		});
	});

	it('is Element and without element', () => {
		expect(parse('a = element a - (b) { sub }')[0]).toStrictEqual({
			type: 'define',
			name: 'a',
			contents: [
				{
					type: 'element',
					name: 'a',
					without: 'b',
					contents: [
						{
							type: 'ref',
							name: 'sub',
						},
					],
				},
			],
		});
	});
});

describe('Attribute', () => {
	it('is Attribute (content ref)', () => {
		expect(parse('a = attribute attrName { sub }')[0].contents).toStrictEqual([
			{
				type: 'attribute',
				name: 'attrName',
				values: {
					type: 'ref',
					name: 'sub',
				},
			},
		]);
	});

	it('is Attribute (content keyword)', () => {
		expect(parse('a = attribute attrName { text }')[0].contents).toStrictEqual([
			{
				type: 'attribute',
				name: 'attrName',
				values: {
					type: 'keyword',
					name: 'text',
				},
			},
		]);
	});

	it('is Attribute (content list)', () => {
		expect(parse('a = attribute attrName { sub | text }')[0].contents).toStrictEqual([
			{
				type: 'attribute',
				name: 'attrName',
				values: {
					choice: [
						{
							type: 'ref',
							name: 'sub',
						},
						{
							type: 'keyword',
							name: 'text',
						},
					],
				},
			},
		]);
	});

	it('is Attribute (content enum)', () => {
		expect(parse('a = attribute attrName { string "" | string "foo" }')[0].contents).toStrictEqual([
			{
				type: 'attribute',
				name: 'attrName',
				values: {
					choice: [
						{
							type: 'string',
							ns: null,
							value: '',
						},
						{
							type: 'string',
							ns: null,
							value: 'foo',
						},
					],
				},
			},
		]);
	});

	it('is Attribute (content enum one string)', () => {
		expect(parse('a = attribute attrName { string "foo" }')[0].contents).toStrictEqual([
			{
				type: 'attribute',
				name: 'attrName',
				values: {
					type: 'string',
					ns: null,
					value: 'foo',
				},
			},
		]);
	});

	it('is Attribute (content enum with namespace)', () => {
		expect(parse('a = attribute attrName { w:string "" | w:string "foo" }')[0].contents).toStrictEqual([
			{
				type: 'attribute',
				name: 'attrName',
				values: {
					choice: [
						{
							type: 'string',
							ns: 'w',
							value: '',
						},
						{
							type: 'string',
							ns: 'w',
							value: 'foo',
						},
					],
				},
			},
		]);
	});

	it('is Attribute (complex contents)', () => {
		expect(parse('a = attribute a { (b & c) | (xsd:string { pattern = "[a-z]" } & x) }')[0].contents).toStrictEqual(
			[
				{
					type: 'attribute',
					name: 'a',
					values: {
						choice: [
							{
								type: 'group',
								contents: {
									interleave: [
										{
											type: 'ref',
											name: 'b',
										},
										{
											type: 'ref',
											name: 'c',
										},
									],
								},
							},
							{
								type: 'group',
								contents: {
									interleave: [
										{
											type: 'string',
											ns: 'xsd',
											params: {
												pattern: '[a-z]',
											},
										},
										{
											type: 'ref',
											name: 'x',
										},
									],
								},
							},
						],
					},
				},
			],
		);
	});
});

describe('Value list', () => {
	it('is value list', () => {
		expect(parse('a = list { token* }')[0].contents).toStrictEqual([
			{
				type: 'list',
				items: [
					{
						type: 'keyword',
						name: 'token',
						required: 'zeroOrMore',
					},
				],
			},
		]);
	});

	it('is value list (required)', () => {
		expect(parse('a = list { token }')[0].contents).toStrictEqual([
			{
				type: 'list',
				items: [
					{
						type: 'keyword',
						name: 'token',
					},
				],
			},
		]);
	});

	it('is value ref list', () => {
		expect(parse('a = list { name:refs+ }')[0].contents).toStrictEqual([
			{
				type: 'list',
				items: [
					{
						type: 'ref',
						ns: 'name',
						name: 'refs',
						required: 'oneOrMore',
					},
				],
			},
		]);
	});

	it('is ordered list', () => {
		expect(parse('a = list { token "a", (string "b")? }')[0].contents).toStrictEqual([
			{
				type: 'list',
				items: [
					{
						type: 'token',
						ns: null,
						value: 'a',
					},
					{
						type: 'string',
						ns: null,
						value: 'b',
						required: 'optional',
					},
				],
			},
		]);
	});

	it('is choice list', () => {
		expect(parse('a = list { token "a" | (string "b")? }')[0].contents).toStrictEqual([
			{
				type: 'list',
				items: [
					{
						choice: [
							{
								type: 'token',
								ns: null,
								value: 'a',
							},
							{
								type: 'string',
								ns: null,
								value: 'b',
								required: 'optional',
							},
						],
					},
				],
			},
		]);
	});
});

describe('Data with params', () => {
	it('is data', () => {
		expect(parse('a = xsd:string { pattern = "[a-z]+" }')[0].contents).toStrictEqual([
			{
				type: 'string',
				ns: 'xsd',
				params: {
					pattern: '[a-z]+',
				},
			},
		]);
	});

	it('is data (2 params)', () => {
		expect(parse('a = xsd:string { pattern = "[a-z]+" length="2" }')[0].contents).toStrictEqual([
			{
				type: 'string',
				ns: 'xsd',
				params: {
					pattern: '[a-z]+',
					length: '2',
				},
			},
		]);
	});

	it('is data in list', () => {
		expect(parse('a = list { xsd:string { pattern = "[a-z]+" }}')[0].contents).toStrictEqual([
			{
				type: 'list',
				items: [
					{
						type: 'string',
						ns: 'xsd',
						params: {
							pattern: '[a-z]+',
						},
					},
				],
			},
		]);
	});
});

describe('Literal', () => {
	it('is string', () => {
		expect(parse('a = "abc"')[0].contents).toStrictEqual([
			{
				type: 'string',
				value: 'abc',
			},
		]);
	});
});

/* eslint-enable */
