<script type="ts">
	import { pixels } from '$lib/image';

	export let guide: string;
	export let oncomplete = () => {};
	export let size = 300;

	const DEBUG = false;
	const COV_THRESHOLD = 0.8;
	const ACC_THRESHOLD = 1;
	const LINE_SIZE = 10;
	const TOLERANCE = 3;
	const FAIL_DELAY = 300;

	let failTimer: number | null = null;
	let points: Array<[number, number]> = [];
	let accuracy = 0;
	let coverage = 0;
	const onmove = (e: PointerEvent) => {
		if (e.buttons !== 1) {
			return;
		}
		points = [...points, [e.offsetX, e.offsetY]];
	};
	const ondown = () => {
		points = [];
	};
	const onup = () => {
		compare();
	};

	const compare = () => {
		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}
		const targetImg = new Image();
		targetImg.src = guide;
		targetImg.width = size;
		targetImg.height = size;
		ctx.drawImage(targetImg, 0, 0);
		ctx.lineWidth = LINE_SIZE * TOLERANCE;
		ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
		ctx.stroke(new Path2D(path));
		DEBUG && console.log(canvas.toDataURL('image/png'));
		let onTarget = 0;
		let targetTotal = 0;
		let inputTotal = 0;
		for (const pixel of pixels(canvas)) {
			if (pixel.a === 0) {
				// blank space
				continue;
			} else if (pixel.r > 0 && pixel.a <= 128) {
				// missed the target
				inputTotal++;
			} else if (pixel.r === 0 && pixel.a > 0) {
				// target missed you
				targetTotal++;
			} else {
				// on target
				targetTotal++;
				onTarget++;
			}
		}
		coverage = onTarget / targetTotal;
		accuracy = onTarget / (inputTotal / TOLERANCE);

		if (coverage >= COV_THRESHOLD && accuracy >= ACC_THRESHOLD) {
			oncomplete();
		} else {
			failTimer = window.setTimeout(() => {
				failTimer = null;
				points = [];
			}, FAIL_DELAY);
		}
	};

	$: path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x},${y}`).join(' ');
</script>

<div
	class="wrapper"
	class:fail={failTimer !== null}
	style:--guide={`url(${guide})`}
	style:--size={`${size}px`}
	on:pointerdown={failTimer === null ? ondown : null}
	on:pointermove={failTimer === null ? onmove : null}
	on:pointerup={failTimer === null ? onup : null}
>
	{#if points.length > 0}
		<svg class="svg" viewBox={`0 0 ${size} ${size}`} style:--lineSize={LINE_SIZE}>
			<path d={path} />
		</svg>
	{/if}
</div>

{#if DEBUG && coverage > 0}
	<div class="score">
		COV: %{Math.round(coverage * 100)}<br />
		ACC: %{Math.round(accuracy * 100)}
	</div>
{/if}

<style>
	.wrapper {
		width: var(--size);
		height: var(--size);
		touch-action: none;
		position: relative;
		border: 2px solid;
		position: relative;
		line-height: 0;
	}
	.wrapper::before {
		content: '';
		pointer-events: none;
		background-image: var(--guide);
		background-repeat: no-repeat;
		background-position: center center;
		position: absolute;
		width: 100%;
		height: 100%;
		opacity: 0.1;
	}
	.svg {
		width: 100%;
		height: 100%;
		fill: none;
		stroke: black;
		stroke-width: var(--lineSize);
		pointer-events: none;
	}
	.fail .svg {
		stroke: red;
	}
	.score {
		position: absolute;
		font-weight: bold;
		text-align: center;
		opacity: 0.7;
		bottom: 20px;
	}
</style>
