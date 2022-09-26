<script type="ts">
	import type { ChangeEvent } from '$lib/event';

	export let size = 24;
	export let onchange = (e: ChangeEvent) => {};
	export let disabled = false;
	export let checked = false;
</script>

<input
	type="checkbox"
	on:change={onchange}
	{disabled}
	{checked}
	class="check"
	style:--size={`${size}px`}
/>

<style>
	.check {
		appearance: none;
		width: var(--size);
		aspect-ratio: 1/1;
		border: 1px solid;
		position: relative;
		margin: 0;
	}

	.check:checked::after {
		content: 'X';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.check:disabled {
		opacity: 0.5;
	}
</style>
