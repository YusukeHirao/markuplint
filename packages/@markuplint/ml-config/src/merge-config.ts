import type {
	Config,
	Nullable,
	AnyRule,
	AnyRuleV2,
	Rules,
	OptimizedConfig,
	OverrodeConfig,
	OptimizedOverrodeConfig,
	Pretender,
	PretenderDetails,
} from './types';

import deepmerge from 'deepmerge';

import { deleteUndefProp, cleanOptions, isRuleConfigValue } from './utils';

export function mergeConfig(a: Config, b?: Config): OptimizedConfig {
	const deleteExtendsProp = !!b;
	b = b ?? {};
	const config: OptimizedConfig = {
		...a,
		...b,
		extends: concatArray(
			Array.isArray(a.extends) ? a.extends : a.extends ? [a.extends] : [],
			Array.isArray(b.extends) ? b.extends : b.extends ? [b.extends] : [],
		),
		plugins: concatArray(a.plugins, b.plugins, true, 'name')?.map(plugin => {
			if (typeof plugin === 'string') {
				return {
					name: plugin,
				};
			}
			return plugin;
		}),
		parser: mergeObject(a.parser, b.parser),
		parserOptions: mergeObject(a.parserOptions, b.parserOptions),
		specs: mergeObject(a.specs, b.specs),
		excludeFiles: concatArray(a.excludeFiles, b.excludeFiles, true),
		pretenders: mergePretenders(a.pretenders, b.pretenders),
		rules: mergeRules(
			// TODO: Deep merge
			a.rules,
			b.rules,
		),
		nodeRules: concatArray(a.nodeRules, b.nodeRules),
		childNodeRules: concatArray(a.childNodeRules, b.childNodeRules),
		overrides: mergeOverrides(a.overrides, b.overrides),
	};
	if (deleteExtendsProp) {
		delete config.extends;
	}
	deleteUndefProp(config);
	return config;
}

export function mergeRule(a: Nullable<AnyRule | AnyRuleV2>, b: AnyRule | AnyRuleV2): AnyRule {
	const oA = optimizeRule(a);
	const oB = optimizeRule(b);

	// Particular behavior:
	// If the right-side value is false, return false.
	// In short; The `false` makes the rule to be disabled absolutely.
	if (oB === false || (!isRuleConfigValue(oB) && oB?.value === false)) {
		return false;
	}

	if (oA === undefined) {
		return oB ?? {};
	}

	if (oB === undefined) {
		return oA;
	}

	if (isRuleConfigValue(oB)) {
		if (isRuleConfigValue(oA)) {
			if (Array.isArray(oA) && Array.isArray(oB)) {
				return [...oA, ...oB];
			}
			return oB;
		}
		const value = Array.isArray(oA.value) && Array.isArray(b) ? [...oA.value, oB] : oB;
		const res = cleanOptions({ ...oA, value });
		deleteUndefProp(res);
		return res;
	}

	const severity = oB.severity ?? (!isRuleConfigValue(oA) ? oA.severity : undefined);
	const value = oB.value ?? (isRuleConfigValue(oA) ? oA : oA.value);
	const options = mergeObject(!isRuleConfigValue(oA) ? oA.options : undefined, oB.options);
	const reason = oB.reason ?? (!isRuleConfigValue(oA) ? oA.reason : undefined);
	const res = {
		severity,
		value,
		options,
		reason,
	};
	deleteUndefProp(res);
	return res;
}

function mergePretenders(
	a?: PretenderDetails | Pretender[],
	b?: PretenderDetails | Pretender[],
): PretenderDetails | undefined {
	if (!a && !b) {
		return;
	}
	const detailA = !Array.isArray(a) ? a : undefined;
	const detailB = !Array.isArray(b) ? b : undefined;
	const details = mergeObject(detailA, detailB) ?? {};
	const dataA = Array.isArray(a) ? a : undefined;
	const dataA2 = detailA?.data;
	const dataB = Array.isArray(b) ? b : undefined;
	const dataB2 = detailB?.data;
	details.data = concatArray(concatArray(dataA, dataA2), concatArray(dataB, dataB2));
	deleteUndefProp(details);
	return details;
}

function mergeOverrides(
	a: Record<string, OverrodeConfig> = {},
	b: Record<string, OverrodeConfig> = {},
): Record<string, OptimizedOverrodeConfig> | undefined {
	const keys = new Set<string>();
	Object.keys(a).forEach(key => keys.add(key));
	Object.keys(b).forEach(key => keys.add(key));

	if (!keys.size) {
		return;
	}

	const result: Record<string, OptimizedOverrodeConfig> = {};

	for (const key of keys) {
		const config = mergeConfig(a[key] ?? {}, b[key] ?? {});
		// @ts-ignore
		delete config.$schema;
		// @ts-ignore
		delete config.extends;
		// @ts-ignore
		delete config.overrides;
		deleteUndefProp(config);
		result[key] = config;
	}

	return result;
}

function mergeObject<T>(a: Nullable<T>, b: Nullable<T>): T | undefined {
	if (a == null) {
		return b || undefined;
	}
	if (b == null) {
		return a || undefined;
	}
	const res = deepmerge<T>(a, b);
	deleteUndefProp(res);
	return res;
}

function concatArray<T extends any>(
	a: Nullable<T[]>,
	b: Nullable<T[]>,
	uniquely = false,
	comparePropName?: string,
): T[] | undefined {
	const newArray: T[] = [];
	function concat(item: T) {
		if (!uniquely) {
			newArray.push(item);
			return;
		}
		if (newArray.includes(item)) {
			return;
		}

		if (!comparePropName) {
			newArray.push(item);
			return;
		}

		const name = getName(item, comparePropName);
		if (!name) {
			newArray.push(item);
			return;
		}

		const existedIndex = newArray.findIndex(e => getName(e, comparePropName) === name);
		if (existedIndex === -1) {
			newArray.push(item);
			return;
		}

		if (typeof item === 'string') {
			return;
		}

		const existed = newArray[existedIndex];
		const merged = mergeObject(existed, item);
		if (!merged) {
			newArray.push(item);
			return;
		}

		newArray.splice(existedIndex, 1, merged);
	}

	a?.forEach(concat);
	b?.forEach(concat);

	return newArray.length === 0 ? undefined : newArray;
}

function getName(item: any, comparePropName: string) {
	if (item == null) {
		return null;
	}
	if (typeof item === 'string') {
		return item;
	}
	if (typeof item === 'object' && item && comparePropName in item && typeof item[comparePropName] === 'string') {
		return item[comparePropName] as string;
	}
	return null;
}

function mergeRules(a?: Rules, b?: Rules): Rules | undefined {
	if (a == null) {
		return b && optimizeRules(b);
	}
	if (b == null) {
		return a && optimizeRules(a);
	}
	const res: Rules = optimizeRules(a);
	for (const [key, rule] of Object.entries(b)) {
		const merged = mergeRule(res[key], rule);
		if (merged != null) {
			res[key] = merged;
		}
	}
	deleteUndefProp(res);
	return res;
}

function optimizeRules(rules: Rules) {
	const res: Rules = {};
	for (const [key, rule] of Object.entries(rules)) {
		const _rule = optimizeRule(rule);
		if (_rule != null) {
			res[key] = _rule;
		}
	}
	return res;
}

function optimizeRule(rule: Nullable<AnyRule | AnyRuleV2>): AnyRule | undefined {
	if (rule === undefined) {
		return;
	}
	if (isRuleConfigValue(rule)) {
		return rule;
	}
	return cleanOptions(rule);
}
