<script type="ts">
	import type { HSV } from '$lib/image';
	import { fade } from 'svelte/transition';
	import camera from '../store/camera';
	import NarrativeBlock from './NarrativeBlock.svelte';

	const MEASURE_TIME = 5000;
	const NARRATIVE_DELAY = 5000;

	export let oncomplete: () => void;

	const pixelCovered = ({ h, s, v }: HSV) => v < 10 || ((h < 15 || h > 355) && s > 80);

	let started = false;
	let timer: number | null = null;
	$: covered = !$camera.find((hsv) => !pixelCovered(hsv));
	$: if (covered && !timer) {
		timer = window.setTimeout(oncomplete, MEASURE_TIME);
	} else if (!covered && timer) {
		clearTimeout(timer);
		timer = null;
	}
</script>

<div class="wrapper">
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
	{#if started}
		<div class="pulse" class:measuring={covered} transition:fade|local={{ duration: 200 }}>
			{#if covered}
				Hold still while I measure your pulse...
			{:else}
				Place your thumb over the camera
			{/if}
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
	.pulse {
		border: 1px solid;
		text-align: center;
		position: relative;
		height: 100px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.pulse::before {
		content: '';
		background: blue;
		opacity: 0.3;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		transform: scale3d(0, 1, 1);
		transform-origin: left center;
	}
	.pulse.measuring::before {
		transform: scale3d(1, 1, 1);
		transition: transform 5000ms linear;
	}
</style>
