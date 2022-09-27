<script type="ts">
	export let text: string;
	export let delay = 0;
	export let glitchDelay = 0;

	const type = () => {
		current = `${current}${text[current.length]}`;
		text.length > current.length && setTimeout(type, delay);
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
	{current}
</div>

<style>
	.wrapper {
	}
</style>
