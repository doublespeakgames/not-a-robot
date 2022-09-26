import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { pixels, RGBToHSV, type HSV } from '$lib/image';

// Small is okay. We just want brightness.
const SIZE = 16;

export default writable<Array<HSV>>([], (set) => {
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
				set([...pixels(canvas)].map(RGBToHSV));
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
