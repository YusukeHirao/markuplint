import { Datatypes, Expression, ExpressionChoice, ExpressionInterleave, Grammer, Namespace, parse } from './tokenizer';
import { parse as pathParse, resolve } from 'path';
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';

const asyncReadFlie = promisify(readFile);

// @ts-ignore
Map.prototype.toJSON = function() {
	// @ts-ignore
	return Array.from(this).reduce((sum, [v, k]) => ((sum[v] = k), sum), {});
};

async function loadRNC(path: string) {
	try {
		const rnc = await asyncReadFlie(path, { encoding: 'utf-8' });
		return parse(rnc);
	} catch (e) {
		// eslint-disable-next-line no-console
		console.warn(e);
	}
	return [];
}

async function getGrammersRecursive(grammers: Grammer[], baseDir: string) {
	const newGrammers: Grammer[] = [];
	for (const grammer of grammers) {
		switch (grammer.type) {
			case 'include': {
				const gs = await loadRNC(resolve(baseDir, `${grammer.filePath}`));
				newGrammers.push(...gs);
				if (grammer.override) {
					newGrammers.push(...grammer.override);
				}
				continue;
			}
		}
		newGrammers.push(grammer);
	}
	return newGrammers;
}

async function main() {
	const basePath = resolve(__dirname, '../../html-ls/schema/html5/html5.rnc');
	const baseDir = pathParse(basePath).dir;
	const _grammers = await loadRNC(basePath);
	const grammers = await getGrammersRecursive(_grammers, baseDir);

	const datatypes = new Map<string, Datatypes>();
	const namespaces = new Map<string, Namespace>();
	const defines = new Map<string, Expression[]>();

	for (const grammer of grammers) {
		switch (grammer.type) {
			case 'datatypes': {
				datatypes.set(grammer.name, grammer);
				break;
			}
			case 'namespace': {
				const name = grammer.name ? grammer.name : grammer.isDefault ? 'default' : null;
				if (name) {
					namespaces.set(name, grammer);
				}
				break;
			}
			case 'define': {
				if (defines.has(grammer.name)) {
					const current = defines.get(grammer.name);
					if (!current) {
						break;
					}
					if (grammer.contents) {
						defines.set(grammer.name, grammer.contents);
					} else if (grammer.choice) {
						let update: ExpressionChoice;
						if (current.length === 1) {
							const content = current[0];
							if ('choice' in content) {
								update = {
									choice: [...content.choice, ...grammer.choice],
								};
							} else {
								update = {
									choice: [...current, ...grammer.choice],
								};
							}
						} else {
							update = {
								choice: [...current, ...grammer.choice],
							};
						}
						defines.set(grammer.name, [update]);
					} else if (grammer.interleave) {
						let update: ExpressionInterleave;
						if (current.length === 1) {
							const content = current[0];
							if ('interleave' in content) {
								update = {
									interleave: [...content.interleave, ...grammer.interleave],
								};
							} else {
								update = {
									interleave: [...current, ...grammer.interleave],
								};
							}
						} else {
							update = {
								interleave: [...current, ...grammer.interleave],
							};
						}
						defines.set(grammer.name, [update]);
					}
				} else {
					defines.set(grammer.name, grammer.contents || []);
				}
				break;
			}
		}
	}

	const result = {
		datatypes,
		namespaces,
		defines,
	};

	writeFile(resolve(__dirname, '../src/spec.json'), JSON.stringify(result, null, 2), () =>
		process.stdout.write('🎉 Generated spec.json.'),
	);
}

Array.prototype.flat = function() {
	return Array.prototype.concat.apply([], this);
};

main();
