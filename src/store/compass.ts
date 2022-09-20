import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export default writable(0, (set) => {
	if (!browser) {
		return;
	}
	const sensor = new AbsoluteOrientationSensor({ frequency: 60 });
	const onRead = (e) => {
		const q = e.currentTarget.quaternion;
		const heading =
			Math.atan2(2 * q[0] * q[1] + 2 * q[2] * q[3], 1 - 2 * q[1] * q[1] - 2 * q[2] * q[2]) *
			(180 / Math.PI);
		set(heading);
	};
	sensor.addEventListener('reading', onRead);
	sensor.start();

	return () => {
		sensor.removeEventListener('reading', onRead);
		sensor.stop();
	};
});
