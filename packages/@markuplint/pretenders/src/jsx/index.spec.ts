import path from 'node:path';

import { jsxScanner } from '.';

const _ = (filePath: string) => filePath.split('/').join(path.sep);

describe('jsxScanner', () => {
	test('001.tsx', async () => {
		expect(await jsxScanner([path.resolve(__dirname, '../../test/fixtures/001.tsx')])).toStrictEqual([
			{
				selector: 'NodeA',
				as: {
					element: 'div',
					attrs: [
						{
							name: 'class',
							value: 'AReturned',
						},
						{
							name: 'aria-xxx',
						},
						{
							name: 'aria-yyy',
						},
					],
				},
				filePath: _('packages/@markuplint/pretenders/test/fixtures/001.tsx:1:6'),
			},
			{
				selector: 'NodeB',
				as: {
					element: 'BReturns',
					inheritAttrs: true,
				},
				filePath: _('packages/@markuplint/pretenders/test/fixtures/001.tsx:11:6'),
			},
			{
				selector: 'NodeC',
				as: 'CReturns',
				filePath: _('packages/@markuplint/pretenders/test/fixtures/001.tsx:15:6'),
			},
			{
				selector: 'NodeD',
				as: 'DReturns',
				filePath: _('packages/@markuplint/pretenders/test/fixtures/001.tsx:25:6'),
			},
			{
				selector: 'NodeE',
				as: 'EReturns',
				filePath: _('packages/@markuplint/pretenders/test/fixtures/001.tsx:27:6'),
			},
			{
				selector: 'NodeF',
				as: 'FReturns',
				filePath: _('packages/@markuplint/pretenders/test/fixtures/001.tsx:33:9'),
			},
			{
				selector: 'NodeG',
				as: 'GReturns',
				filePath: _('packages/@markuplint/pretenders/test/fixtures/001.tsx:38:16'),
			},
			{
				selector: 'NodeH',
				as: 'HReturns',
				filePath: _('packages/@markuplint/pretenders/test/fixtures/001.tsx:42:24'),
			},
			{
				selector: 'NodeI',
				as: 'IReturns',
				filePath: _('packages/@markuplint/pretenders/test/fixtures/001.tsx:46:9'),
			},
		]);
	});

	test('002', async () => {
		expect(
			await jsxScanner([path.resolve(__dirname, '../../test/fixtures/002.tsx')], {
				ignoreComponentNames: ['FooBar'],
			}),
		).toStrictEqual([]);
	});

	test('003', async () => {
		expect(await jsxScanner([path.resolve(__dirname, '../../test/fixtures/003.tsx')])).toStrictEqual([
			{
				selector: 'Button',
				as: {
					element: 'button',
					inheritAttrs: true,
				},
				filePath: _('packages/@markuplint/pretenders/test/fixtures/003.tsx:2:6'),
			},
			{
				selector: 'MyComponent2',
				_via: ['Button'],
				as: {
					element: 'button',
					inheritAttrs: true,
				},
				filePath: _('packages/@markuplint/pretenders/test/fixtures/003.tsx:2:6'),
			},
		]);

		expect(
			await jsxScanner([path.resolve(__dirname, '../../test/fixtures/003.tsx')], {
				taggedStylingComponent: [/^ORIGINAL_IDENTIFIER\.(?<tagName>[a-z][a-z0-9]*)$/],
			}),
		).toStrictEqual([
			{
				selector: 'MyComponent',
				as: {
					element: 'div',
					inheritAttrs: true,
				},
				filePath: _('packages/@markuplint/pretenders/test/fixtures/003.tsx:7:6'),
			},
		]);
	});

	test('004', async () => {
		expect(
			await jsxScanner([path.resolve(__dirname, '../../test/fixtures/004.tsx')], {
				extendingWrapper: [
					'secondary',
					{
						identifier: '/namespace\\.[a-z]+/i',
						numberOfArgument: 2,
					},
				],
			}),
		).toStrictEqual([
			{
				selector: 'AnyPrimaryButton',
				as: {
					element: 'Button',
					inheritAttrs: true,
				},
				filePath: _('packages/@markuplint/pretenders/test/fixtures/004.tsx:2:6'),
			},
			{
				selector: 'SecondaryButton',
				as: {
					element: 'Button',
					inheritAttrs: true,
				},
				filePath: _('packages/@markuplint/pretenders/test/fixtures/004.tsx:1:6'),
			},
		]);
	});
});
