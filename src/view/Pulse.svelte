<script type="ts">
	import type { HSV } from '$lib/image';
	import camera from '../store/camera';

	const MEASURE_TIME = 5000;

	export let oncomplete: () => void;

	const pixelCovered = ({ h, s, v }: HSV) => v < 10 || ((h < 15 || h > 355) && s > 80);

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
	<div class="label">
		{#if covered}
			Hold still while we measure your pulse...
		{:else}
			Place your thumb over the camera
		{/if}
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
