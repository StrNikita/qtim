import * as gen from 'random-seed';

export function randomStringBySeed(length: number, seed: string): string {
	const radomSeed = gen.create(seed);
	let str = '';
	while (str.length < length) {
			str += radomSeed.random().toString(36).substring(2);
	}
	return str.substring(0, length);
};
