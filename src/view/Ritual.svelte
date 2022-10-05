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
	import Spinner from './Spinner.svelte';

	type Step = {
		dir: keyof typeof directions;
		shape: string;
	};

	const COMPLETE_DELAY = 2000;
	const NARRATIVE_DELAY = 4000;
	const COMPASS_THRESHOLD = 6; // degrees
	const FACING_TIMER = 2000;

	export let oncomplete: () => void;

	let narrativeStep = 0;
	let traceEnabled = false;
	let compassEnabled = false;
	let step = 0;
	let timer: number | null = null;
	let computing = false;

	$: target = steps[step].dir;
	$: targetBearing = directions[target];
	$: facing = $compass !== null && Math.round(delta($compass, targetBearing)) <= COMPASS_THRESHOLD;

	$: if (compassEnabled && !traceEnabled && narrativeStep === 0 && facing && !timer) {
		timer = window.setTimeout(() => (narrativeStep = 1), FACING_TIMER);
	} else if (timer && !facing) {
		clearTimeout(timer);
		timer = null;
	}

	const complete = () => {
		computing = true;
		setTimeout(oncomplete, COMPLETE_DELAY);
	};

	const ontrace = () => {
		if (step === 0) {
			traceEnabled = false;
			narrativeStep = 2;
		} else if (step === 3) {
			complete();
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

{#if !computing}
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
{/if}

{#if computing}
	<div class="spinner" in:fade>
		<Spinner size={40} />
	</div>
{:else}
	<div class="wrapper">
		{#if compassEnabled}
			<div transition:slide|local>
				{#if $compass === null}
					<div class="mock">
						No compass? <br />Something to hide, robot?
					</div>
				{:else}
					<div style="position:relative">
						<Compass bearing={$compass} />
						<div class="compass-target" class:active={facing}>
							Face {target}
						</div>
					</div>
				{/if}
			</div>
		{/if}
		{#if !computing && traceEnabled && facing}
			<div class="trace" transition:slide|local>
				<Trace oncomplete={ontrace} guide={steps[step].shape} />
			</div>
		{/if}
	</div>
{/if}

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
		opacity: 0.1;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 48px;
		transition: opacity 300ms;
	}
	.compass-target.active {
		opacity: 0;
	}
	.trace {
		display: flex;
		justify-content: center;
	}
	.mock {
		text-align: center;
		font-style: italic;
	}
	.spinner {
		display: flex;
		justify-content: center;
	}
</style>
