import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { pixels, RGBToHSV, type HSV } from '$lib/image';

// Small is okay. We just want brightness.
const SIZE = 16;

export default writable<HSV>({ h: 0, s: 0, v: 0 }, (set) => {
	if (!browser) {
		return;
	}

	let killed = false;
	navigator.mediaDevices
		.getUserMedia({ video: { facingMode: 'user' } })
		.then((mediaStream) => {
			const video = document.createElement('video');
			const canvas = document.createElement('canvas');
			canvas.width = canvas.height = SIZE;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				return;
			}
			video.srcObject = mediaStream;
			video.onloadedmetadata = () => {
				video.play();
			};
			requestAnimationFrame(function sample() {
				!killed && requestAnimationFrame(sample);
				ctx.drawImage(video, 0, 0, SIZE, SIZE);
				let numPixels = 0;
				const total: HSV = { h: 0, s: 0, v: 0 };
				for (const pixel of pixels(canvas)) {
					const { h, s, v } = RGBToHSV(pixel);
					total.h += h;
					total.s += s;
					total.v += v;
					numPixels++;
				}
				set({
					h: total.h / numPixels,
					s: total.s / numPixels,
					v: total.v / numPixels
				});
			});
		})
		.catch((err) => {
			// always check for errors at the end.
			console.error(`${err.name}: ${err.message}`);
		});

	return () => {
		killed = true;
	};
});
