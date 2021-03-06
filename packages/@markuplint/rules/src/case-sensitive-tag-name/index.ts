import { Result, createRule } from '@markuplint/ml-core';

export type Value = 'lower' | 'upper';

export default createRule<Value, null>({
	name: 'case-sensitive-tag-name',
	defaultLevel: 'warning',
	defaultValue: 'lower',
	defaultOptions: null,
	async verify(document, translate) {
		const reports: Result[] = [];
		await document.walk(async node => {
			if ('fixNodeName' in node) {
				if (node.isForeignElement || node.isCustomElement) {
					return;
				}
				const ms = node.rule.severity === 'error' ? 'must' : 'should';
				const deny = node.rule.value === 'lower' ? /[A-Z]/ : /[a-z]/;
				const message = translate(
					`{0} of {1} ${ms} be {2}`,
					'Tag name',
					'HTML elements',
					`${node.rule.value}case`,
				);
				if (deny.test(node.nodeName)) {
					const loc = node.getNameLocation();
					reports.push({
						severity: node.rule.severity,
						message,
						line: loc.line,
						col: loc.col,
						raw: node.nodeName,
					});
				}
			}
		});
		return reports;
	},
	async fix(document) {
		await document.walk(async node => {
			if ('fixNodeName' in node) {
				if (node.isForeignElement || node.isCustomElement) {
					return;
				}
				const deny = node.rule.value === 'lower' ? /[A-Z]/ : /[a-z]/;
				if (deny.test(node.nodeName)) {
					if (node.rule.value === 'lower') {
						node.fixNodeName(node.nodeName.toLowerCase());
					} else {
						node.fixNodeName(node.nodeName.toUpperCase());
					}
				}
			}
		});
	},
});
