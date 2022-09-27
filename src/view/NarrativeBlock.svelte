<script type="ts">
	import { fade } from 'svelte/transition';
	import Narrative from './Narrative.svelte';

	export let lines: Array<string>;
	export let delay: number;
	export let oncomplete = () => {};

	const advance = () => {
		progress < lines.length - 1 && setTimeout(advance, delay);
		if (++progress >= lines.length - 1) {
			oncomplete();
		}
	};

	setTimeout(advance, delay);

	let progress = 0;
</script>

<div class="wrapper">
	{#each lines as line, i (line)}
		{#if progress === i || (progress >= lines.length && i === lines.length - 1)}
			<div class="line" transition:fade|local>
				<Narrative text={line} />
			</div>
		{/if}
	{/each}
</div>

<style>
	.wrapper {
		position: relative;
	}
	.line {
		position: absolute;
	}
</style>
