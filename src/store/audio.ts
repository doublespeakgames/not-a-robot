import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export default writable<Uint8Array>(new Uint8Array(), (set) => {
	if (!browser) {
		return;
	}

	let killed = false;
	navigator.mediaDevices
		.getUserMedia({ audio: true })
		.then((mediaStream) => {
			const context = new AudioContext();
			const source = context.createMediaStreamSource(mediaStream);
			const analyser = context.createAnalyser();
			source.connect(analyser);
			analyser.fftSize = 2048;
			const bufferLength = analyser.frequencyBinCount;

			(function listen() {
				!killed && requestAnimationFrame(listen);
				const data = new Uint8Array(bufferLength);
				analyser.getByteTimeDomainData(data);
				set(data);
			})();
		})
		.catch((err) => {
			// always check for errors at the end.
			console.error(`${err.name}: ${err.message}`);
		});

	return () => {
		killed = true;
	};
});
