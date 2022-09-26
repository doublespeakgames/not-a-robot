import { writable, get } from 'svelte/store';
import syllable from './syllable';

const TIME_WINDOW = 2000;

const WordStore = () => {
	let clearTimer: number | null = null;

	const store = writable<Array<number>>([0], (set) => {
		return syllable.subscribe((syllables) => {
			clearTimer && clearTimeout(clearTimer);
			const words = get(store);
			const currentWord = words[words.length - 1];
			if (syllables > currentWord) {
				set([...words.slice(0, -1), syllables]);
			} else if (syllables === 0 && currentWord > 0) {
				set([...words, 0]);
				clearTimer = window.setTimeout(clear, TIME_WINDOW);
			}
		});
	});

	const clear = () => {
		clearTimer && clearTimeout(clearTimer);
		store.set([0]);
	};

	return {
		subscribe: store.subscribe,
		clear
	};
};

export default WordStore();
