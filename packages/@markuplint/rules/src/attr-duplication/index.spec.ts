import * as markuplint from 'markuplint';
import rule from './';

test('is test 1', async () => {
	const r = await markuplint.verify(
		`
		<div data-attr="value" data-Attr='db' data-attR=tr>
			lorem
			<p>ipsam</p>
		</div>
		`,
		{
			rules: {
				'attr-duplication': true,
			},
		},
		[rule],
		'en',
	);

	expect(r).toStrictEqual([
		{
			severity: 'error',
			message: 'Duplicate attribute name',
			line: 2,
			col: 26,
			raw: 'data-Attr',
			ruleId: 'attr-duplication',
		},
		{
			severity: 'error',
			message: 'Duplicate attribute name',
			line: 2,
			col: 41,
			raw: 'data-attR',
			ruleId: 'attr-duplication',
		},
	]);
});

test('is test 2', async () => {
	const r = await markuplint.verify(
		`
		<div
			data-attr="value"
			data-Attr='db'
			data-attR=tr>
			lorem
			<p>ipsam</p>
		</div>
		`,
		{
			rules: {
				'attr-duplication': true,
			},
		},
		[rule],
		'en',
	);

	expect(r).toStrictEqual([
		{
			severity: 'error',
			message: 'Duplicate attribute name',
			line: 4,
			col: 4,
			raw: 'data-Attr',
			ruleId: 'attr-duplication',
		},
		{
			severity: 'error',
			message: 'Duplicate attribute name',
			line: 5,
			col: 4,
			raw: 'data-attR',
			ruleId: 'attr-duplication',
		},
	]);
});

test('is test 3', async () => {
	const r = await markuplint.verify(
		'<img src="/" SRC="/" >',
		{
			rules: {
				'attr-duplication': true,
			},
		},
		[rule],
		'ja',
	);

	expect(r.map(_ => _.message)).toStrictEqual(['属性名が重複しています']);
});

test('nodeRules disable', async () => {
	const r = await markuplint.verify(
		'<div><span attr attr></span></div>',
		{
			rules: {
				'attr-duplication': true,
			},
			nodeRules: [
				{
					selector: 'span',
					rules: {
						'attr-duplication': false,
					},
				},
			],
		},
		[rule],
		'en',
	);

	expect(r.length).toStrictEqual(0);
});

test('Vue', async () => {
	const r = await markuplint.verify(
		'<template><div attr v-bind:attr /></template>',
		{
			rules: {
				'attr-duplication': true,
			},
			parser: {
				'.*': '@markuplint/vue-parser',
			},
		},
		[rule],
		'en',
	);

	expect(r).toStrictEqual([
		{
			ruleId: 'attr-duplication',
			severity: 'error',
			line: 1,
			col: 21,
			message: 'Duplicate attribute name',
			raw: 'v-bind:attr',
		},
	]);
});

test('React', async () => {
	const r = await markuplint.verify(
		'<div tabindex tabIndex />',
		{
			rules: {
				'attr-duplication': true,
			},
			parser: {
				'.*': '@markuplint/vue-parser',
			},
		},
		[rule],
		'en',
	);

	expect(r).toStrictEqual([]);
});

test('Pug', async () => {
	const r = await markuplint.verify(
		'.hoge(class="hoge2")&attributes({class: "hoge3"})',
		{
			rules: {
				'attr-duplication': true,
			},
			parser: {
				'.*': '@markuplint/pug-parser',
			},
		},
		[rule],
		'en',
	);

	expect(r.length).toBe(0);
});

test('Svelte', async () => {
	const r = await markuplint.verify(
		'<div class:selected="{isSelected}" class:focused="{isFocused}"></div>',
		{
			rules: {
				'attr-duplication': true,
			},
			parser: {
				'.*': '@markuplint/svelte-parser',
			},
		},
		[rule],
		'en',
	);

	expect(r.length).toBe(0);
});
