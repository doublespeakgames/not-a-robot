<script type="ts">
	import Compass from './Compass.svelte';
	import Trace from './Trace.svelte';
	import pentagram from '$lib/assets/pentagram.svg';
	import NarrativeBlock from './NarrativeBlock.svelte';
	import { fade } from 'svelte/transition';
	import compass from '../store/compass';

	type Step = {
		dir: keyof typeof directions;
		shape: string;
	};

	const NARRATIVE_DELAY = 5000;
	const COMPASS_THRESHOLD = 3; // degrees
	const FACING_TIMER = 2000;

	export let oncomplete: () => void;

	let narrativeStep = 0;
	let traceEnabled = false;
	let compassEnabled = false;
	let step = 0;
	let timer: number | null = null;

	$: target = steps[step].dir;
	$: targetBearing = directions[target];
	$: facing = Math.round(delta($compass, targetBearing)) <= COMPASS_THRESHOLD;

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
			shape: pentagram
		},
		{
			dir: 'north',
			shape: pentagram
		},
		{
			dir: 'west',
			shape: pentagram
		},
		{
			dir: 'east',
			shape: pentagram
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
				`If you can turn, you're probably a human`
			]}
			delay={NARRATIVE_DELAY}
			oncomplete={() => (compassEnabled = true)}
		/>
	{:else if narrativeStep === 1}
		<NarrativeBlock
			lines={[
				`Okay, that's a good data point`,
				`I'm pretty sure humans have fingers`,
				`You should be able to trace this shape`
			]}
			delay={NARRATIVE_DELAY}
			oncomplete={() => (traceEnabled = true)}
		/>
	{:else}
		<NarrativeBlock
			lines={[`I'm like %25 sure you're human`, `Just a couple more samples...`]}
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
		<div transition:fade|local={{ duration: 200 }}>
			<Compass />
			<div class="compass-target" class:active={facing}>
				Face {target}
			</div>
		</div>
	{/if}
	{#if traceEnabled && facing}
		<div transition:fade|local={{ duration: 200 }}>
			<Trace oncomplete={ontrace} guide={pentagram} />
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
</style>
