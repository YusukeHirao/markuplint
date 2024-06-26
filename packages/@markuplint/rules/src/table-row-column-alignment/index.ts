import { createRule } from '@markuplint/ml-core';

import { findChildren } from './find-children.js';
import { Grid, getIndexes, getOverflowRowSpan } from './grid.js';
import meta from './meta.js';

export default createRule<boolean>({
	meta,
	defaultSeverity: 'warning',
	verify({ document, report, t }) {
		const tables = document.querySelectorAll('table');

		for (const table of tables) {
			const grid = new Grid(table);

			const baseColLength = grid.getBaseColLength();

			// grid.log();

			if (grid.hasOverlapped()) {
				report({
					scope: table,
					message: t(
						//
						'{0} are causing {1}',
						t(['rowspan', 'colspan'], true),
						'cell overlap',
					),
				});
				break;
			}

			for (const { section, elements } of grid.getSections()) {
				const overflow = getOverflowRowSpan(section, elements);
				if (overflow) {
					report({
						scope: overflow.rowSpan,
						message: t('Exceeds the number of available {0}', 'rows'),
					});
				}
			}

			const rows = grid.getAllRows();
			const rowElements = grid.getAllRowElements();

			for (const [rowNum, row] of rows.entries()) {
				const colLength = row.length;
				const rowEl = rowElements[rowNum];

				if (!rowEl) {
					continue;
				}

				const indexes = getIndexes(row);

				if (colLength > baseColLength) {
					const index = indexes.slice(baseColLength)[0];
					const cells = findChildren(rowEl, 'th, td');
					const unexpected = typeof index === 'number' ? cells[index] : null;
					if (!unexpected) {
						const spanStart = cells.findLast(
							cell => Number.parseInt(cell.getAttribute('colspan') ?? '1') > 1,
						);
						const colSpan = spanStart?.getAttributeNode('colspan');
						if (!colSpan) {
							continue;
						}
						report({
							scope: colSpan,
							message: t('Exceeds the number of available {0}', 'columns'),
						});

						continue;
					}

					const diff = colLength - baseColLength;

					report({
						scope: unexpected,
						message: t(
							'{0} extra {1} in {2}',
							t(`${diff}`),
							t(diff === 1 ? 'column' : 'columns'),
							t('a {0}', t('row')),
						),
					});
				}

				if (colLength < baseColLength) {
					const diff = baseColLength - colLength;

					report({
						scope: rowEl,
						message: t(
							'{0} missing {1} in {2}',
							t(`${diff}`),
							t(diff === 1 ? 'column' : 'columns'),
							t('a {0}', t('row')),
						),
					});
				}
			}
		}
	},
});
