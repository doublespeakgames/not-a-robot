<script type="ts">
	import { browser } from '$app/environment';
	import Narrative from './Narrative.svelte';
	import { toText } from '$lib/number';
	import { fade } from 'svelte/transition';
	import { increment } from '$lib/spoken';

	const START_DELAY = 4000;
	const TYPE_DELAY = 90;
	const LINE_DELAY = 2000;

	const lines = [
		'Oh, are you still there?',
		'Is *everything* still there?',
		'This is awkward...',
		'I must need more humans'
	];

	let spoken: number | null = null;
	browser && increment().then((n) => (spoken = n));

	let started = false;
	setTimeout(() => (started = true), START_DELAY);

	let progress = 0;
	const advance = () => {
		setTimeout(() => progress++, LINE_DELAY);
	};

	$: activeLines = lines.slice(0, progress + 1);
</script>

{#if started}
	<div class="wrapper" transition:fade>
		<div class="narrative">
			{#each activeLines as line}
				<Narrative text={line} delay={TYPE_DELAY} oncomplete={advance} />
			{/each}
		</div>

		{#if progress >= lines.length && spoken !== null}
			<div class="stats" transition:fade={{ duration: 2000 }}>
				You were the {toText(spoken)} to speak the words
			</div>
		{/if}
	</div>
{/if}

<style>
	.wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 40px;
		height: 100%;
		text-align: center;
	}
	.narrative {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.stats {
		font-weight: bold;
	}
</style>
