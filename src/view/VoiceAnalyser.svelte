<script type="ts">
	import { slide } from 'svelte/transition';
	import audio from '../store/audio';
	import word from '../store/word';
	import syllable from '../store/syllable';
	import Oscilloscope from './Oscilloscope.svelte';

	export let oncomplete: () => void;

	const DEBUG = false;
	const FAIL_DELAY = 1000;
	const TOLERANCE = 1;

	type Status = 'in-progress' | 'failed' | 'complete';

	export let words: Array<Array<string>>;

	let failTimer: number | null = null;
	let status: Status;

	$: noMic = $audio.length === 0;
	$: spoken = $word;
	$: status = status === 'complete' ? 'complete' : isValid(spoken, words);
	$: if (status === 'failed') {
		syllable.paused(true);
		failTimer = window.setTimeout(() => {
			syllable.paused(false);
			failTimer = null;
		}, FAIL_DELAY);
		setTimeout(word.clear, 0);
	} else if (status === 'complete') {
		oncomplete();
	}

	const isValid = (spoken: Array<number>, words: Array<Array<string>>): Status => {
		const lastSpoken = spoken[spoken.length - 1];
		if (lastSpoken > 0 && lastSpoken - words[spoken.length - 1].length > TOLERANCE) {
			DEBUG && console.log('Too many syllables', spoken, words);
			return 'failed';
		}
		for (let i = 0, len = spoken.length; i < len - 1; i++) {
			const s = spoken[i];
			if (s > 0 && Math.abs(s - words[i].length) > TOLERANCE) {
				DEBUG &&
					console.log(`Too ${s > words[i].length ? 'many' : 'few'} syllables`, spoken, words);
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
</script>

<div class="wrapper" transition:slide|local={{ duration: 1000 }} class:fail={failTimer !== null}>
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
	.fail .syllable {
		color: red;
		opacity: 1;
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
