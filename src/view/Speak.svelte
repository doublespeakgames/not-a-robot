<script type="ts">
	import audio from '../store/audio';
	import word from '../store/word';
	import Oscilloscope from './Oscilloscope.svelte';

	export let oncomplete: () => void;

	type Status = 'in-progress' | 'failed' | 'complete';

	const words = [
		['Klaa', 'tu'],
		['Bar', 'a', 'da'],
		['Nik', 'to']
	];

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
</script>

<div class="wrapper">
	<Oscilloscope data={$audio} />
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
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
	}
	.words {
		display: flex;
		gap: 10px;
		font-weight: bold;
		font-size: 28px;
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
</style>
