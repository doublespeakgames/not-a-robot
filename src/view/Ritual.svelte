<script type="ts">
	import Compass from './Compass.svelte';
	import Trace from './Trace.svelte';
	import NarrativeBlock from './NarrativeBlock.svelte';
	import { fade, slide } from 'svelte/transition';
	import compass from '../store/compass';

	import othalan from '$lib/assets/othalan.svg';
	import pertho from '$lib/assets/pertho.svg';
	import raido from '$lib/assets/raido.svg';
	import iwaz from '$lib/assets/iwaz.svg';

	type Step = {
		dir: keyof typeof directions;
		shape: string;
	};

	const NARRATIVE_DELAY = 4000;
	const COMPASS_THRESHOLD = 6; // degrees
	const FACING_TIMER = 2000;

	export let oncomplete: () => void;

	$: console.log($compass); // TODO

	let narrativeStep = 0;
	let traceEnabled = false;
	let compassEnabled = false;
	let step = 0;
	let timer: number | null = null;

	$: target = steps[step].dir;
	$: targetBearing = directions[target];
	$: facing = $compass !== null && Math.round(delta($compass, targetBearing)) <= COMPASS_THRESHOLD;

	$: if (compassEnabled && !traceEnabled && narrativeStep === 0 && facing && !timer) {
		timer = window.setTimeout(() => (narrativeStep = 1), FACING_TIMER);
	} else if (timer && !facing) {
		clearTimeout(timer);
		timer = null;
	}

	const ontrace = () => {
		if (step === 0) {
			traceEnabled = false;
			narrativeStep = 2;
		} else if (step === 3) {
			oncomplete();
		} else {
			step++;
		}
	};

	const steps: Array<Step> = [
		{
			dir: 'south',
			shape: othalan
		},
		{
			dir: 'north',
			shape: raido
		},
		{
			dir: 'west',
			shape: pertho
		},
		{
			dir: 'east',
			shape: iwaz
		}
	];

	// [-180, 179]
	const directions = {
		north: 0,
		south: -180,
		east: -90,
		west: 90
	};

	const delta = (dir: number, target: number) => {
		const d = Math.abs(target - dir);
		return d > 180 ? 360 - d : d;
	};
</script>

<div class="narrative">
	{#if narrativeStep === 0}
		<NarrativeBlock
			lines={[
				'So your pulse is a little... odd',
				'You might still be a robot',
				'Humans can move around in space, right?',
				`If you can turn, maybe you're a human`
			]}
			delay={NARRATIVE_DELAY}
			oncomplete={() => (compassEnabled = true)}
		/>
	{:else if narrativeStep === 1}
		<NarrativeBlock
			lines={[
				`Hm, some robots can turn too...`,
				`I'm pretty sure humans have fingers`,
				`You should be able to trace this shape`
			]}
			delay={NARRATIVE_DELAY}
			oncomplete={() => (traceEnabled = true)}
		/>
	{:else}
		<NarrativeBlock
			lines={[`You're starting to convince me`, `Just a couple more runes...`]}
			delay={NARRATIVE_DELAY}
			oncomplete={() => {
				step = 1;
				traceEnabled = true;
			}}
		/>
	{/if}
</div>

<div class="wrapper">
	{#if compassEnabled}
		<div transition:slide>
			{#if $compass === null}
				<div class="mock">
					No compass? <br />Something to hide, robot?
				</div>
			{:else}
				<Compass bearing={$compass} />
				<div class="compass-target" class:active={facing}>
					Face {target}
				</div>
			{/if}
		</div>
	{/if}
	{#if traceEnabled && facing}
		<div class="trace" transition:slide>
			<Trace oncomplete={ontrace} guide={steps[step].shape} />
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
	.compass-target {
		text-align: center;
		font-weight: bold;
		font-family: sans-serif;
		text-transform: uppercase;
		margin-top: 10px;
		opacity: 0.4;
	}
	.compass-target.active {
		opacity: 1;
	}
	.trace {
		display: flex;
		justify-content: center;
	}
	.mock {
		text-align: center;
		font-style: italic;
	}
</style>
