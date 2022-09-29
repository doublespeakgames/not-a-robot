<script type="ts">
	export let text: string;
	export let delay = 0;
	export let glitchDelay = 0;
	export let oncomplete = () => {};

	let bold = false;
	let index = 0;
	const type = () => {
		const nextChar = text[index++];
		if (nextChar !== '*') {
			current = `${current}${nextChar}`;
		} else {
			current = `${current}${
				bold ? '</span>' : '<span style="font-weight:bold; font-style:italic">'
			}`;
			bold = !bold;
		}
		const d = ['*', '.', ','].includes(nextChar) ? delay * 4 : delay;
		if (text.length > index) {
			setTimeout(type, d);
		} else {
			oncomplete();
		}
	};

	const glitch = () => {
		const i = Math.floor(Math.random() * current.length);
		const c = current[i];
		const glitched = c.toUpperCase() === c ? c.toLowerCase() : c.toUpperCase();
		current = `${current.slice(0, i)}${glitched}${current.slice(i + 1)}`;
	};

	let current = delay <= 0 ? text : '';
	delay > 0 && setTimeout(type, delay);
	glitchDelay > 0 && setInterval(glitch, glitchDelay);
</script>

<div class="wrapper">
	{@html current}
</div>

<style>
	.wrapper {
	}
</style>
