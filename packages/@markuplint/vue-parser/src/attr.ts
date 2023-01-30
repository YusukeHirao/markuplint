import type { MLASTAttr } from '@markuplint/ml-ast';

const duplicatableAttrs = ['class', 'style'];

export function attr(attr: MLASTAttr): MLASTAttr {
	if (attr.type !== 'html-attr') {
		const name = attr.potentialName;
		if (duplicatableAttrs.includes(name)) {
			attr.isDuplicatable = true;
		}
		return attr;
	}

	{
		/**
		 * `v-on`
		 */
		const [, directive, potentialName, modifier] = attr.name.raw.match(/^(v-on:|@)([^.]+)(?:\.([^.]))?$/i) || [];
		if (directive && potentialName) {
			return {
				...attr,
				potentialName: `on${potentialName.toLowerCase()}`,
				isDynamicValue: true,
				// @ts-ignore
				_modifier: modifier,
			};
		}
	}

	{
		/**
		 * `v-bind`
		 */
		const [, directive, potentialName, modifier] = attr.name.raw.match(/^(v-bind:|:)([^.]+)(?:\.([^.]))?$/i) || [];
		if (directive && potentialName) {
			if (duplicatableAttrs.includes(potentialName.toLowerCase())) {
				attr.isDuplicatable = true;
			}

			if (!modifier) {
				return {
					...attr,
					potentialName,
					isDynamicValue: true,
				};
			}

			switch (modifier) {
				case '.attr': {
					return {
						...attr,
						potentialName,
						isDynamicValue: true,
						// @ts-ignore
						_modifier: modifier,
					};
				}
				// TODO: Supporting for `prop` and `camel` https://github.com/markuplint/markuplint/pull/681
				case '.prop':
				case '.camel':
				default: {
					const name = `v-bind:${potentialName}${modifier ?? ''}`;
					return {
						...attr,
						potentialName: attr.name.raw !== name ? name : undefined,
						isDirective: true,
						// @ts-ignore
						_modifier: modifier,
					};
				}
			}
		}
	}

	{
		/**
		 * `v-model`
		 */
		const [, directive, modifier] = attr.name.raw.match(/^(v-model)(?:\.([^.]))?$/i) || [];
		if (directive) {
			// TODO: Supporting for `v-model` https://github.com/markuplint/markuplint/pull/681
			return {
				...attr,
				isDirective: true,
				// @ts-ignore
				_modifier: modifier,
			};
		}
	}

	{
		/**
		 * `v-slot`
		 */
		const [, , slotName] = attr.name.raw.match(/^(v-slot:|#)(.+)$/i) || [];
		const name = `v-slot:${slotName}`;
		if (slotName) {
			return {
				...attr,
				potentialName: attr.name.raw !== name ? name : undefined,
				isDirective: true,
			};
		}
	}

	/**
	 * If directives
	 */
	if (/^v-/.test(attr.name.raw)) {
		return {
			...attr,
			isDirective: true,
		};
	}

	return attr;
}
