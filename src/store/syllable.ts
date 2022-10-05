import RingBuffer from '$lib/ring-buffer';
import { readable, get } from 'svelte/store';
import audio from './audio';

const TIME_WINDOW = 400; //ms
const HIGH_THRESHOLD = 20;
const LOW_THRESHOLD = -10;

const SyllableStore = () => {
	let paused = false;
	const store = readable<number>(0, (set) => {
		const buffer = RingBuffer<number>(10);
		let lastVal = 0;
		let high = false;
		let last = Date.now();
		return audio.subscribe((vals) => {
			if (!paused) {
				const amp = Math.max(...vals.map((v) => Math.abs(v - 128)));
				buffer.push(amp - lastVal);
				lastVal = amp;
				const totalDelta = [...buffer].reduce((sum, cur) => sum + cur, 0);
				if (totalDelta >= HIGH_THRESHOLD && !high) {
					high = true;
				} else if (totalDelta <= LOW_THRESHOLD && high) {
					high = false;
					last = Date.now();
					set(get(store) + 1);
				}
			}

			if (Date.now() - last >= TIME_WINDOW && get(store) > 0) {
				set(0);
			}
		});
	});

	return {
		subscribe: store.subscribe,
		paused: (p: boolean) => (paused = p)
	};
};

export default SyllableStore();
