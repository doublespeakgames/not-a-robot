<script type="ts">
	import type { HSV } from '$lib/image';
	import { slide } from 'svelte/transition';
	import camera from '../store/camera';

	const MEASURE_TIME = 5000;

	export let oncomplete: () => void;

	const pixelCovered = ({ h, s, v }: HSV) => {
		if (h === 0 && s === 0 && v === 0) {
			return false;
		}
		return v < 10 || ((h < 15 || h > 350) && s > 75);
	};

	let timer: number | null = null;
	$: noCamera = $camera.length === 0;
	$: badPixels = $camera.filter((hsv) => !pixelCovered(hsv));
	$: covered = $camera.length > 0 && badPixels.length === 0;
	$: if (covered && !timer) {
		timer = window.setTimeout(oncomplete, MEASURE_TIME);
	} else if (!covered && timer) {
		clearTimeout(timer);
		timer = null;
	}
</script>

<div class="pulse" class:measuring={covered} in:slide|local>
	{#if noCamera}
		<div class="mock">
			No camera? <br />Something to hide, robot?
		</div>
	{:else if covered}
		Hold still while I measure your pulse...
	{:else}
		Place your thumb over the camera
	{/if}
</div>

<style>
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
	.mock {
		text-align: center;
		font-style: italic;
	}
</style>
