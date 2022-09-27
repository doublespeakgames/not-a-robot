<script type="ts">
	import Compass from './Compass.svelte';
	import Trace from './Trace.svelte';
	import pentagram from '$lib/assets/pentagram.svg';
	import NarrativeBlock from './NarrativeBlock.svelte';
	import { fade } from 'svelte/transition';

	const NARRATIVE_DELAY = 5000;

	export let oncomplete: () => void;

	let step = 0;
</script>

<div class="narrative">
	<NarrativeBlock
		lines={[
			'So your pulse is a little... odd',
			'You might still be a robot',
			'Humans can move around in space, right?',
			`Let's check your ability to turn`
		]}
		delay={NARRATIVE_DELAY}
		oncomplete={() => (step = 1)}
	/>
</div>

<div class="wrapper" transition:fade|local={{ duration: 200 }}>
	{#if step > 0}
		<div transition:fade|local={{ duration: 200 }}>
			<Compass />
		</div>
	{/if}
	{#if step > 1}
		<div transition:fade|local={{ duration: 200 }}>
			<Trace {oncomplete} guide={pentagram} />
		</div>
	{/if}
</div>

<style>
	.wrapper {
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.narrative {
		height: 24px;
	}
</style>
