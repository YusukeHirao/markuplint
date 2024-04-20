import type { CustomParser } from './types.js';

// @ts-ignore
import { tokenize, parse } from 'espree';

export function scriptParser(script: string): ScriptTokenType[] {
	const tokens = tokenize(script, {
		ecmaVersion: 'latest',
		loc: false,
	});

	return tokens.map<ScriptTokenType>((token: any) => ({
		type: token.type,
		value: token.value,
	}));
}

export function safeScriptParser(script: string, parse: CustomParser = defaultParse) {
	let { validScript, leftover } = safeParse(script, parse);

	// Support for object literal
	if (leftover.trim()) {
		const assignment = '$=';
		({ validScript } = safeParse(`${assignment}${script}`, parse));
		validScript = validScript.length > assignment.length ? validScript.slice(assignment.length) : '';
	}

	// Support for spread operator
	if (validScript.trim() === '') {
		const coverStart = '$={';
		const coverEnd = '}';
		({ validScript } = safeParse(`${coverStart}${script}${coverEnd}`, parse));
		const coverEndLastIndex = validScript.lastIndexOf(coverEnd);
		validScript =
			validScript.length > coverStart.length + coverEnd.length
				? validScript.slice(coverStart.length, coverEndLastIndex)
				: '';
	}

	leftover = script.slice(validScript.length);

	return {
		validScript,
		leftover,
	};
}

function safeParse(script: string, parse: CustomParser) {
	let validScript: string;
	let leftover: string;
	try {
		parse(script);
		validScript = script;
		leftover = '';
	} catch (error) {
		if (error instanceof SyntaxError && 'index' in error && typeof error.index === 'number') {
			let index = error.index;
			const unexpectedToken = script.slice(index);
			if (unexpectedToken.trim() === '') {
				index = script.search(/\S\s*$/);
			}
			validScript = script.slice(0, index);
			leftover = script.slice(index);
		} else {
			throw error;
		}
	}

	return {
		validScript,
		leftover,
	};
}

function defaultParse(script: string) {
	parse(script, {
		ecmaVersion: 'latest',
		ecmaFeatures: {
			jsx: true,
		},
	});
}

export type ScriptTokenType = {
	type: 'Identifier' | 'Boolean' | 'Numeric' | 'String' | 'Template' | 'Punctuator';
	value: string;
};
