const ONES = [
	['', ''],
	['first', 'one'],
	['second', 'two'],
	['third', 'three'],
	['fourth', 'four'],
	['fifth', 'five'],
	['sixth', 'six'],
	['seventh', 'seven'],
	['eighth', 'eight'],
	['ninth', 'nine'],
	['tenth', 'ten'],
	['eleventh', 'eleven'],
	['twelvth', 'twelve'],
	['thirteenth', 'thirteen'],
	['fourteenth', 'fourteen'],
	['fifteenth', 'fifteen'],
	['sixteenth', 'sixteen'],
	['seventeenth', 'seventeen'],
	['eighteenth', 'eighteen'],
	['nineteenth', 'nineteen']
];
const TENS = ['twenty', 'thirty', 'fourty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export const roundToPlaces = (num: number, places: number): number => {
	const mod = Math.pow(10, places);
	return Math.round(num * mod) / mod;
};

const onesToText = (num: number, last = false) => {
	const t = Math.floor(num / 10) % 10;
	let text = num % 100 < 20 ? ONES[num % 100][last ? 0 : 1] : ONES[num % 10][last ? 0 : 1];
	if (t >= 2) {
		text = `${TENS[t - 2]} ${text}`;
	}
	return text;
};

const hundredsToText = (num: number) => {
	const hundreds = Math.floor((num / 100) % 10);
	return hundreds > 0 ? `${ONES[hundreds][1]} hundred` : '';
};

export const toText = (num: number) => {
	let text = onesToText(num, true);

	const hundreds = Math.floor(num / 100) % 10;
	if (hundreds) {
		text = text.length > 0 ? `${hundredsToText(num)} and ${text}` : `${hundredsToText(num)}th`;
	}

	const thousands = Math.floor((num / 1000) % 1000);
	if (thousands) {
		text = `${hundredsToText(thousands)} ${onesToText(thousands)} thousand ${text}`;
	}

	const millions = Math.floor((num / 1000000) % 1000);
	if (millions) {
		text = `${hundredsToText(millions)} ${onesToText(millions)} million ${text}`;
	}

	text = text.trim();
	if (text.endsWith('y')) {
		text = `${text.slice(0, -1)}ieth`;
	}

	return text;
};
