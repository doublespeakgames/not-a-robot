<script type="ts">
	import { fade, slide } from 'svelte/transition';
	import audio from '../store/audio';
	import word from '../store/word';
	import Narrative from './Narrative.svelte';
	import NarrativeBlock from './NarrativeBlock.svelte';
	import Oscilloscope from './Oscilloscope.svelte';

	export let oncomplete: () => void;

	type Status = 'in-progress' | 'failed' | 'complete';

	const NARRATIVE_DELAY = 4000;
	const words = [['Ex', 'i', 'te'], ['et'], ['de', 'vor', 'a', 'te'], ['mun', 'dum']];

	$: noMic = $audio.length === 0;
	$: spoken = $word;
	$: status = isValid(spoken, words);
	$: if (status === 'failed') {
		setTimeout(word.clear, 0);
	} else if (status === 'complete') {
		oncomplete();
	}

	const isValid = (spoken: Array<number>, words: Array<Array<string>>): Status => {
		const lastSpoken = spoken[spoken.length - 1];
		if (lastSpoken > 0 && lastSpoken > words[spoken.length - 1].length) {
			return 'failed';
		}
		for (let i = 0, len = spoken.length; i < len - 1; i++) {
			const s = spoken[i];
			if (s > 0 && s !== words[i].length) {
				return 'failed';
			}
		}
		if (spoken.length > words.length) {
			return 'complete';
		}
		return 'in-progress';
	};

	const isActive = (word: number, syllable: number, spoken: Array<number>): boolean => {
		const currIndex = spoken.length - 1;
		if (currIndex > word) {
			return true;
		}
		if (currIndex < word) {
			return false;
		}
		return syllable < spoken[currIndex];
	};

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
	<div class="wrapper" transition:slide|local={{ duration: 1000 }}>
		{#if noMic}
			<div class="mock">
				No microphone?<br />Something to hide, robot?
			</div>
		{:else}
			<div class="osc">
				<Oscilloscope data={$audio} />
			</div>
			<div class="words">
				{#each words as word, wordIndex}
					<div class="word">
						{#each word as syllable, syllableIndex}
							<div class="syllable" class:active={isActive(wordIndex, syllableIndex, spoken)}>
								{syllable}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.wrapper {
		border: 1px solid;
		position: relative;
		margin-top: 10px;
	}
	.osc {
		opacity: 0.4;
		line-height: 0;
	}
	.words {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		column-gap: 10px;
		font-weight: bold;
		font-size: 28px;
		align-items: center;
		align-content: center;
		justify-content: center;
		flex-wrap: wrap;
	}
	.word {
		display: flex;
	}
	.syllable {
		opacity: 0.4;
	}
	.syllable.active {
		opacity: 1;
	}
	.narrative {
		min-height: 1rem;
	}
	.mock {
		text-align: center;
		font-style: italic;
		aspect-ratio: 2/1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
