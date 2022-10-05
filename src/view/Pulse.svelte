<script type="ts">
	import { fade, slide } from 'svelte/transition';
	import NarrativeBlock from './NarrativeBlock.svelte';
	import Spinner from './Spinner.svelte';
	import PulseReader from './PulseReader.svelte';

	const COMPLETE_DELAY = 2000;
	const NARRATIVE_DELAY = 4000;

	export let oncomplete: () => void;

	const complete = () => {
		computing = true;
		setTimeout(oncomplete, COMPLETE_DELAY);
	};

	let started = false;
	let computing = false;
</script>

<div class="wrapper" in:slide>
	{#if !computing}
		<div class="narrative">
			<NarrativeBlock
				lines={[
					`Okay, let's try something else`,
					`I hear that humans have blood, and that it usually moves around`,
					`Maybe we can check that`,
					`Use your camera to test your pulse`
				]}
				delay={NARRATIVE_DELAY}
				oncomplete={() => (started = true)}
			/>
		</div>
	{/if}
	{#if started && !computing}
		<PulseReader oncomplete={complete} />
	{/if}
	{#if computing}
		<div class="spinner" in:fade>
			<Spinner size={40} />
		</div>
	{/if}
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-height: 2rem;
	}
	.narrative {
		height: 20px;
	}
	.spinner {
		display: flex;
		justify-content: center;
	}
</style>
