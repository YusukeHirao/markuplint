import type { PermittedContentPattern } from '@markuplint/ml-spec';

import specs from '@markuplint/html-spec';
import { createTestElement } from '@markuplint/ml-core';

import { countPattern } from './count-pattern';

function c(models: Parameters<typeof countPattern>[0], innerHtml: string) {
	const el = createTestElement(`<div>${innerHtml}</div>`);
	return countPattern(models, Array.from(el.childNodes), specs, { ignoreHasMutableChildren: true }, 0);
}

it('require: a', () => {
	expect(c({ require: 'a' }, '<a></a>').type).toBe('MATCHED');
	expect(c({ require: 'a' }, '<b></b>').type).toBe('MISSING_NODE_REQUIRED');
	expect(c({ require: 'a' }, '<c></c>').type).toBe('MISSING_NODE_REQUIRED');
	expect(c({ require: 'a' }, 'text').type).toBe('MISSING_NODE_REQUIRED');
	expect(c({ require: 'a' }, '').type).toBe('MISSING_NODE_REQUIRED');

	expect(c({ require: 'a' }, '<a></a>').matched.length).toBe(1);
	expect(c({ require: 'a' }, '<b></b>').matched.length).toBe(0);
	expect(c({ require: 'a' }, '<c></c>').matched.length).toBe(0);
	expect(c({ require: 'a' }, 'text').matched.length).toBe(0);
	expect(c({ require: 'a' }, '').matched.length).toBe(0);
});

it('optional: a', () => {
	expect(c({ optional: 'a' }, '<a></a>').type).toBe('MATCHED');
	expect(c({ optional: 'a' }, '<a></a><a></a>').type).toBe('UNEXPECTED_EXTRA_NODE');
	expect(c({ optional: 'a' }, '<b></b>').type).toBe('MATCHED_ZERO');
	expect(c({ optional: 'a' }, '<c></c>').type).toBe('MATCHED_ZERO');
	expect(c({ optional: 'a' }, 'text').type).toBe('MATCHED_ZERO');
	expect(c({ optional: 'a' }, '').type).toBe('MATCHED_ZERO');

	expect(c({ optional: 'a' }, '<a></a>').matched.length).toBe(1);
	expect(c({ optional: 'a' }, '<a></a><a></a>').matched.length).toBe(1);
	expect(c({ optional: 'a' }, '<b></b>').matched.length).toBe(0);
	expect(c({ optional: 'a' }, '<c></c>').matched.length).toBe(0);
	expect(c({ optional: 'a' }, 'text').matched.length).toBe(0);
	expect(c({ optional: 'a' }, '').matched.length).toBe(0);
});

it('oneOrMore: a', () => {
	expect(c({ oneOrMore: 'a' }, '<a></a>').type).toBe('MATCHED');
	expect(c({ oneOrMore: 'a' }, '<b></b>').type).toBe('MISSING_NODE_ONE_OR_MORE');
	expect(c({ oneOrMore: 'a' }, '<c></c>').type).toBe('MISSING_NODE_ONE_OR_MORE');
	expect(c({ oneOrMore: 'a' }, 'text').type).toBe('MISSING_NODE_ONE_OR_MORE');
	expect(c({ oneOrMore: 'a' }, '').type).toBe('MISSING_NODE_ONE_OR_MORE');

	expect(c({ oneOrMore: 'a' }, '<a></a>').matched.length).toBe(1);
	expect(c({ oneOrMore: 'a' }, '<b></b>').matched.length).toBe(0);
	expect(c({ oneOrMore: 'a' }, '<c></c>').matched.length).toBe(0);
	expect(c({ oneOrMore: 'a' }, 'text').matched.length).toBe(0);
	expect(c({ oneOrMore: 'a' }, '').matched.length).toBe(0);

	expect(c({ oneOrMore: 'a' }, '<a></a><a></a><a></a>').matched.length).toBe(3);
	expect(c({ oneOrMore: 'a' }, '<a></a><a></a><b></b>').matched.length).toBe(2);
	expect(c({ oneOrMore: 'a' }, '<a></a><c></c><c></c>').matched.length).toBe(1);
});

it('zeroOrMore: a', () => {
	expect(c({ zeroOrMore: 'a' }, '<a></a>').type).toBe('MATCHED');
	expect(c({ zeroOrMore: 'a' }, '<b></b>').type).toBe('MATCHED_ZERO');
	expect(c({ zeroOrMore: 'a' }, '<c></c>').type).toBe('MATCHED_ZERO');
	expect(c({ zeroOrMore: 'a' }, 'text').type).toBe('MATCHED_ZERO');
	expect(c({ zeroOrMore: 'a' }, '').type).toBe('MATCHED_ZERO');

	expect(c({ zeroOrMore: 'a' }, '<a></a>').matched.length).toBe(1);
	expect(c({ zeroOrMore: 'a' }, '<b></b>').matched.length).toBe(0);
	expect(c({ zeroOrMore: 'a' }, '<c></c>').matched.length).toBe(0);
	expect(c({ zeroOrMore: 'a' }, 'text').matched.length).toBe(0);
	expect(c({ zeroOrMore: 'a' }, '').matched.length).toBe(0);

	expect(c({ zeroOrMore: 'a' }, '<a></a><a></a><a></a>').matched.length).toBe(3);
	expect(c({ zeroOrMore: 'a' }, '<a></a><a></a><b></b>').matched.length).toBe(2);
	expect(c({ zeroOrMore: 'a' }, '<a></a><c></c><c></c>').matched.length).toBe(1);
});

it('require: #flow', () => {
	expect(c({ require: '#flow' }, '<a></a>').type).toBe('MATCHED');
	expect(c({ require: '#flow' }, '<b></b>').type).toBe('MATCHED');
	expect(c({ require: '#flow' }, '<c></c>').type).toBe('MATCHED_ZERO');
	expect(c({ require: '#flow' }, 'text').type).toBe('MATCHED');
	expect(c({ require: '#flow' }, '').type).toBe('MATCHED_ZERO');

	expect(c({ require: '#flow' }, '<a></a>').matched.length).toBe(1);
	expect(c({ require: '#flow' }, '<b></b>').matched.length).toBe(1);
	expect(c({ require: '#flow' }, '<c></c>').matched.length).toBe(0);
	expect(c({ require: '#flow' }, 'text').matched.length).toBe(1);
	expect(c({ require: '#flow' }, '').matched.length).toBe(0);

	expect(c({ require: '#flow' }, '<a></a><a></a><a></a>').matched.length).toBe(1);
	expect(c({ require: '#flow' }, '<b></b><a></a>').matched.length).toBe(1);
	expect(c({ require: '#flow' }, '<c></c><a></a>').matched.length).toBe(0);
	expect(c({ require: '#flow' }, 'text<a></a>').matched.length).toBe(1);
	expect(c({ require: '#flow' }, '<a></a>').matched.length).toBe(1);

	expect(c({ require: '#flow' }, '<a></a><a></a>').matched[0].nodeName).toBe('A');
	expect(c({ require: '#flow' }, '<b></b><a></a>').matched[0].nodeName).toBe('B');
	expect(c({ require: '#flow' }, 'text<a></a>').matched[0].nodeName).toBe('#text');
	expect(c({ require: '#flow' }, '<a></a>').matched[0].nodeName).toBe('A');
});

it('optional: #flow', () => {
	expect(c({ optional: '#flow' }, '<a></a>').type).toBe('MATCHED');
	expect(c({ optional: '#flow' }, '<b></b>').type).toBe('MATCHED');
	expect(c({ optional: '#flow' }, '<c></c>').type).toBe('MATCHED_ZERO');
	expect(c({ optional: '#flow' }, 'text').type).toBe('MATCHED');
	expect(c({ optional: '#flow' }, '').type).toBe('MATCHED_ZERO');

	expect(c({ optional: '#flow' }, '<a></a>').matched.length).toBe(1);
	expect(c({ optional: '#flow' }, '<b></b>').matched.length).toBe(1);
	expect(c({ optional: '#flow' }, '<c></c>').matched.length).toBe(0);
	expect(c({ optional: '#flow' }, 'text').matched.length).toBe(1);
	expect(c({ optional: '#flow' }, '').matched.length).toBe(0);
});

it('oneOrMore: #flow', () => {
	expect(c({ oneOrMore: '#flow' }, '<a></a>').type).toBe('MATCHED');
	expect(c({ oneOrMore: '#flow' }, '<b></b>').type).toBe('MATCHED');
	expect(c({ oneOrMore: '#flow' }, '<c></c>').type).toBe('MATCHED_ZERO');
	expect(c({ oneOrMore: '#flow' }, 'text').type).toBe('MATCHED');
	expect(c({ oneOrMore: '#flow' }, '').type).toBe('MATCHED_ZERO');

	expect(c({ oneOrMore: '#flow' }, '<a></a>').matched.length).toBe(1);
	expect(c({ oneOrMore: '#flow' }, '<b></b>').matched.length).toBe(1);
	expect(c({ oneOrMore: '#flow' }, '<c></c>').matched.length).toBe(0);
	expect(c({ oneOrMore: '#flow' }, 'text').matched.length).toBe(1);
	expect(c({ oneOrMore: '#flow' }, '').matched.length).toBe(0);

	expect(c({ oneOrMore: '#flow' }, '<a></a><a></a><a></a>').matched.length).toBe(3);
	expect(c({ oneOrMore: '#flow' }, '<a></a><a></a><b></b>').matched.length).toBe(3);
	expect(c({ oneOrMore: '#flow' }, '<a></a><c></c><c></c>').matched.length).toBe(1);
});

it('zeroOrMore: #flow', () => {
	expect(c({ zeroOrMore: '#flow' }, '<a></a>').type).toBe('MATCHED');
	expect(c({ zeroOrMore: '#flow' }, '<b></b>').type).toBe('MATCHED');
	expect(c({ zeroOrMore: '#flow' }, '<c></c>').type).toBe('MATCHED_ZERO');
	expect(c({ zeroOrMore: '#flow' }, 'text').type).toBe('MATCHED');
	expect(c({ zeroOrMore: '#flow' }, '').type).toBe('MATCHED_ZERO');

	expect(c({ zeroOrMore: '#flow' }, '<a></a>').matched.length).toBe(1);
	expect(c({ zeroOrMore: '#flow' }, '<b></b>').matched.length).toBe(1);
	expect(c({ zeroOrMore: '#flow' }, '<c></c>').matched.length).toBe(0);
	expect(c({ zeroOrMore: '#flow' }, 'text').matched.length).toBe(1);
	expect(c({ zeroOrMore: '#flow' }, '').matched.length).toBe(0);

	expect(c({ zeroOrMore: '#flow' }, '<a></a><a></a><a></a>').matched.length).toBe(3);
	expect(c({ zeroOrMore: '#flow' }, '<a></a><a></a><b></b>').matched.length).toBe(3);
	expect(c({ zeroOrMore: '#flow' }, '<a></a><c></c><c></c>').matched.length).toBe(1);
});

it('zeroOrMore: :model(script-supporting)', () => {
	expect(c({ zeroOrMore: ':model(script-supporting)' }, '<a></a>').type).toBe('MATCHED_ZERO');
	expect(c({ zeroOrMore: ':model(script-supporting)' }, '<b></b>').type).toBe('MATCHED_ZERO');
	expect(c({ zeroOrMore: ':model(script-supporting)' }, '<c></c>').type).toBe('MATCHED_ZERO');
	expect(c({ zeroOrMore: ':model(script-supporting)' }, 'text').type).toBe('MATCHED_ZERO');
	expect(c({ zeroOrMore: ':model(script-supporting)' }, '').type).toBe('MATCHED_ZERO');
	expect(c({ zeroOrMore: ':model(script-supporting)' }, '<script></script>').type).toBe('MATCHED');
	expect(c({ zeroOrMore: ':model(script-supporting)' }, '<template></template>').type).toBe('MATCHED');

	expect(c({ zeroOrMore: ':model(script-supporting)' }, '<a></a>').matched.length).toBe(0);
	expect(c({ zeroOrMore: ':model(script-supporting)' }, '<b></b>').matched.length).toBe(0);
	expect(c({ zeroOrMore: ':model(script-supporting)' }, '<c></c>').matched.length).toBe(0);
	expect(c({ zeroOrMore: ':model(script-supporting)' }, 'text').matched.length).toBe(0);
	expect(c({ zeroOrMore: ':model(script-supporting)' }, '').matched.length).toBe(0);
	expect(c({ zeroOrMore: ':model(script-supporting)' }, '<script></script>').matched.length).toBe(1);
	expect(c({ zeroOrMore: ':model(script-supporting)' }, '<template></template>').matched.length).toBe(1);
});

it('min/max', () => {
	expect(c({ require: 'c', min: 2 }, '').type).toBe('MISSING_NODE_REQUIRED');
	expect(c({ require: 'c', min: 2 }, '<c></c>').type).toBe('MISSING_NODE_REQUIRED');
	expect(c({ require: 'c', min: 2 }, '<c></c><c></c>').type).toBe('MATCHED');
	expect(c({ require: 'c', max: 1 }, '<c></c><c></c>').type).toBe('UNEXPECTED_EXTRA_NODE');
	expect(c({ require: 'c', max: 1 }, '<c></c><c></c>').hint?.max).toBe(1);
});

it('the dl element', () => {
	const models: PermittedContentPattern = {
		oneOrMore: [
			{
				zeroOrMore: ':model(script-supporting)',
			},
			{
				oneOrMore: 'dt',
			},
			{
				zeroOrMore: ':model(script-supporting)',
			},
			{
				oneOrMore: 'dd',
			},
			{
				zeroOrMore: ':model(script-supporting)',
			},
		],
	};

	expect(c(models, '<dt></dt>').type).toBe('MISSING_NODE_ONE_OR_MORE');
	expect(c(models, '<dd></dd>').type).toBe('MISSING_NODE_ONE_OR_MORE');
	expect(c(models, '<dt></dt><dd></dd>').type).toBe('MATCHED');
	expect(c(models, '<dt></dt><dt></dt><dd></dd>').type).toBe('MATCHED');
	expect(c(models, '<dt></dt><dd></dd><dd></dd>').type).toBe('MATCHED');
	expect(c(models, '<dt></dt><dd></dd><dd></dd><dt></dt>').type).toBe('MISSING_NODE_ONE_OR_MORE');
});

it('part of the ruby element', () => {
	expect(c({ require: ':model(phrasing):not(ruby, :has(ruby))' }, '<span></span>').type).toBe('MATCHED');
});

it('part of the ruby element', () => {
	const models: PermittedContentPattern = {
		oneOrMore: [
			{
				require: ':model(phrasing):not(ruby, :has(ruby))',
			},
			{
				choice: [
					[
						{
							oneOrMore: 'rt',
						},
					],
					[
						{
							oneOrMore: [
								{
									require: 'rp',
								},
								{
									oneOrMore: [
										{
											require: 'rt',
										},
										{
											require: 'rp',
										},
									],
								},
							],
						},
					],
				],
			},
		],
	};

	expect(c(models, '<span></span>').type).toBe('MISSING_NODE_ONE_OR_MORE');
	expect(c(models, '<span></span>').query).toBe('rt');
	expect(c(models, '<span></span><rp></rp><rt></rt><rp></rp>').type).toBe('MATCHED');
	expect(c(models, '<span></span><rp></rp><rt></rt>').type).toBe('MISSING_NODE_REQUIRED');
	expect(c(models, '<span></span><rp></rp><rt></rt>').query).toBe('rp');
});

it('part of the ruby element', () => {
	const models: PermittedContentPattern = {
		oneOrMore: [
			{
				require: 'rp',
			},
			{
				oneOrMore: [
					{
						require: 'rt',
					},
					{
						require: 'rp',
					},
				],
			},
		],
	};

	expect(c(models, '<rt></rt>').type).toBe('MISSING_NODE_REQUIRED');
	expect(c(models, '<rt></rt>').query).toBe('rp');
	expect(c(models, '<rp></rp><rt></rt><rp></rp>').type).toBe('MATCHED');
	expect(c(models, '<rp></rp><rt></rt>').type).toBe('MISSING_NODE_REQUIRED');
	expect(c(models, '<rp></rp><rt></rt>').query).toBe('rp');
});

it('part of the ruby element', () => {
	const models: PermittedContentPattern = {
		oneOrMore: [
			{
				require: 'rt',
			},
			{
				require: 'rp',
			},
		],
	};

	expect(c(models, '<rt></rt>').type).toBe('MISSING_NODE_REQUIRED');
	expect(c(models, '<rt></rt>').query).toBe('rp');
	expect(c(models, '<rt></rt><rp></rp>').type).toBe('MATCHED');
});