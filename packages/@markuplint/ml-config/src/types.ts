import type { ParserOptions } from '@markuplint/ml-ast';
import type { RegexSelector } from '@markuplint/selector';

export type { RegexSelector } from '@markuplint/selector';

export type Config = {
	$schema?: string;
	extends?: string | string[];
	plugins?: (PluginConfig | string)[];
	parser?: ParserConfig;
	parserOptions?: ParserOptions;
	specs?: SpecConfig;
	excludeFiles?: string[];
	pretenders?: PretenderDetails | Pretender[];
	rules?: Rules;
	nodeRules?: NodeRule[];
	childNodeRules?: ChildNodeRule[];
	overrides?: Record<string, OverrodeConfig>;
};

export type OverrodeConfig = Omit<Config, '$schema' | 'extends' | 'overrides'>;

export type OptimizedConfig = Omit<Config, '$schema' | 'extends' | 'plugins' | 'pretenders' | 'overrides'> & {
	extends?: string[];
	plugins?: PluginConfig[];
	pretenders?: PretenderDetails;
	overrides?: Record<string, OptimizedOverrodeConfig>;
};

export type OptimizedOverrodeConfig = Omit<OptimizedConfig, 'extends' | 'overrides'>;

export type PluginConfig = {
	name: string;
	settings?: Record<string, any>;
};

export interface ParserConfig {
	[extensionPattern: string]: string /* module name or path */;
}

export type SpecConfig = {
	[extensionPattern: string]: string /* module name or path */;
};

export type PretenderDetails = {
	files?: string[];

	/**
	 * Dynamic scaning
	 *
	 * @experimental
	 */
	scan?: PretenderScanConfig[];

	/**
	 * @experimental
	 */
	imports?: string[];
	data?: Pretender[];
};

export type PretenderScanConfig = {
	/**
	 * Supporting for Glob format
	 */
	files: string;
	type: string;
	options: PretenderScanOptions;
};

export interface PretenderScanOptions {
	cwd?: string;
	ignoreComponentNames?: string[];
	[extend: string]: any;
}

export type PretenderFileData = {
	version: string;
	data: Pretender[];
};

export type Pretender = {
	/**
	 * Target node selectors
	 */
	selector: string;

	/**
	 * If it is a string, it is resolved as an element name.
	 * An element has the same attributes as the pretended custom element
	 * because attributes are just inherited.
	 *
	 * If it is an Object, It creates the element by that.
	 */
	as: string | OriginalNode;

	filePath?: string;
};

export type OriginalNode = {
	/**
	 * Element name
	 */
	element: string;

	/**
	 * Namespace
	 *
	 * Supports `"svg"` and `undefined` only.
	 * If it is `undefined`, the namespace is HTML.
	 */
	namespace?: 'svg';

	/**
	 * Attributes
	 */
	attrs?: PretenderAttr[];

	/**
	 * To have attributes the defined element has.
	 */
	inheritAttrs?: boolean;

	/**
	 * ARIA properties
	 */
	aria?: PretenderARIA;
};

export type PretenderAttr = {
	/**
	 * Attribute name
	 */
	name: string;

	/**
	 * If it omits this property, the attribute is resolved as a boolean.
	 */
	value?:
		| string
		| {
				fromAttr: string;
		  };
};

/**
 * Pretender Node ARIA properties
 */
export type PretenderARIA = {
	/**
	 * Accessible name
	 *
	 * - If it is `true`, it assumes the element has any text on its accessible name.
	 * - If it specifies `fromAttr` property, it assumes the accessible name refers to the value of the attribute.
	 */
	name?:
		| boolean
		| {
				fromAttr: string;
		  };
};

export type Rule<T extends RuleConfigValue, O = void> = RuleConfig<T, O> | T | boolean;

/**
 * @deprecated
 */
export type RuleV2<T extends RuleConfigValue, O = void> = RuleConfigV2<T, O> | T | boolean;

export type AnyRule = Rule<RuleConfigValue, unknown>;

/**
 * @deprecated
 */
export type AnyRuleV2 = RuleV2<RuleConfigValue, unknown>;

export interface Rules {
	[ruleName: string]: AnyRule;
}

export type RuleConfig<T extends RuleConfigValue, O = void> = {
	severity?: Severity;
	value?: T;
	options?: O;
	reason?: string;
};

/**
 * @deprecated
 */
export type RuleConfigV2<T extends RuleConfigValue, O = void> = {
	severity?: Severity;
	value?: T;
	reason?: string;

	/**
	 * Old property
	 *
	 * @deprecated
	 * @see {this.options}
	 */
	option?: O;
};

export type Severity = 'error' | 'warning' | 'info';

export type RuleConfigValue = string | number | boolean | any[] | null;

export interface NodeRule {
	selector?: string;
	regexSelector?: RegexSelector;
	categories?: string[];
	roles?: string[];
	obsolete?: boolean;
	rules?: Rules;
}

export interface ChildNodeRule {
	selector?: string;
	regexSelector?: RegexSelector;
	inheritance?: boolean;
	rules?: Rules;
}

export type Report<T extends RuleConfigValue, O = null> = Report1<T, O> | Report2 | (Report1<T, O> & Report2);

export type Report1<T extends RuleConfigValue, O = null> = {
	message: string;
	scope: Scope<T, O>;
};

export type Report2 = {
	message: string;
	line: number;
	col: number;
	raw: string;
};

export type Scope<T extends RuleConfigValue, O = null> = {
	rule: RuleInfo<T, O>;
	startLine: number;
	startCol: number;
	raw: string;
};

export interface Violation {
	ruleId: string;
	severity: Severity;
	message: string;
	reason?: string;
	line: number;
	col: number;
	raw: string;
}

export interface RuleInfo<T extends RuleConfigValue, O = null> {
	disabled: boolean;
	severity: Severity;
	value: T;
	options: O;
	reason?: string;
}

export type GlobalRuleInfo<T extends RuleConfigValue, O = null> = RuleInfo<T, O> & {
	nodeRules: RuleInfo<T, O>[];
	childNodeRules: RuleInfo<T, O>[];
};

export type Nullable<T> = T | null | undefined;
