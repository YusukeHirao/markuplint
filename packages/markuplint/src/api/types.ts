import type { AnyMLRule, MLSchema, Ruleset } from '@markuplint/ml-core';
import type { Config, Violation } from '@markuplint/ml-config';
import type { ConfigSet } from '@markuplint/file-resolver';
import type { I18n } from '@markuplint/i18n';
import type { MLMarkupLanguageParser } from '@markuplint/ml-ast';
import type { ParserOptions } from '@markuplint/ml-config';

export type APIOptions = {
	configFile?: string;
	config?: Config;
	defaultConfig?: Config;
	noSearchConfig?: boolean;
	autoLoad?: boolean;
	locale?: string;
	fix?: boolean;
	extMatch?: boolean;
	rules?: AnyMLRule[];
	importPresetRules?: boolean;
};

export type MLFabric = {
	ruleset: Ruleset;
	rules: AnyMLRule[];
	schemas: MLSchema;
	parser: MLMarkupLanguageParser;
	parserOptions: ParserOptions;
	i18n: I18n;
};

export type MLEngineEventMap = {
	log: (phase: string, message: string) => void;
	config: (filePath: string, config: ConfigSet, message?: string) => void;
	exclude: (filePath: string, setting: string, message?: string) => void;
	parser: (filePath: string, parser: string, message?: string) => void;
	ruleset: (filePath: string, ruleset: Ruleset, message?: string) => void;
	schemas: (filePath: string, schemas: MLSchema, message?: string) => void;
	rules: (filePath: string, rules: AnyMLRule[], message?: string) => void;
	i18n: (filePath: string, i18n: I18n, message?: string) => void;
	code: (filePath: string, sourceCode: string, message?: string) => void;
	lint: (filePath: string, sourceCode: string, violations: Violation[], fixedCode: string, message?: string) => void;
};