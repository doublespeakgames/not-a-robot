<script type="ts">
	export let text: string;
	export let delay = 0;

	const type = () => {
		text !== current && setTimeout(type, delay);
		current = text.substring(0, current.length + 1);
	};

	let current = delay <= 0 ? text : '';
	delay > 0 && setTimeout(type, delay);
</script>

<div class="wrapper">
	{current}
</div>

<style>
	.wrapper {
	}
</style>
