<script type="ts">
	import Narrative from './Narrative.svelte';
	import NarrativeBlock from './NarrativeBlock.svelte';
	import VoiceAnalyser from './VoiceAnalyser.svelte';

	export let oncomplete: () => void;

	const NARRATIVE_DELAY = 4000;
	const words = [['Ex', 'i', 'te'], ['et'], ['de', 'vor', 'a', 'te'], ['mun', 'dum']];

	let active = false;
	let step = 0;
</script>

<div class="narrative">
	{#if step === 0}
		<NarrativeBlock
			lines={[`You're probably a human?`, `Just one last thing...`, '']}
			delay={NARRATIVE_DELAY}
			oncomplete={() => {
				step = 1;
				active = true;
			}}
		/>
	{:else}
		<Narrative text="only a human can speak the words" delay={100} glitchDelay={200} />
	{/if}
</div>

{#if active}
	<VoiceAnalyser {words} {oncomplete} />
{/if}

<style>
	.narrative {
		min-height: 1rem;
	}
</style>
