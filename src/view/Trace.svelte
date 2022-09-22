<script type="ts">
	import { pixels } from '$lib/image';

	export let guide = 'pentagram';

	const COMPARE_SIZE = 312;
	const LINE_SIZE = 10;
	const TOLERANCE = 3;

	let width: number;
	let height: number;
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
		canvas.width = canvas.height = COMPARE_SIZE;
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}
		const targetImg = new Image();
		targetImg.src = guideUrl;
		ctx.drawImage(targetImg, 0, 0);
		ctx.lineWidth = LINE_SIZE * TOLERANCE;
		ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
		ctx.stroke(new Path2D(path));
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
	};

	$: guideUrl = `./${guide}.svg`;
	$: path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x},${y}`).join(' ');
</script>

<div
	class="wrapper"
	style:--guide={`url(${guideUrl})`}
	bind:clientHeight={height}
	bind:clientWidth={width}
	on:pointerdown={ondown}
	on:pointermove={onmove}
	on:pointerup={onup}
>
	{#if points.length > 0}
		<svg class="svg" viewBox={`0 0 ${width} ${height}`} style:--lineSize={LINE_SIZE}>
			<path d={path} />
		</svg>
	{/if}
</div>

{#if coverage > 0}
	<div class="score">
		COV: %{Math.round(coverage * 100)}<br />
		ACC: %{Math.round(accuracy * 100)}
	</div>
{/if}

<style>
	.wrapper {
		max-width: 100%;
		max-height: 100%;
		aspect-ratio: 1/1;
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
	.score {
		font-size: 48px;
		line-height: 2;
		font-weight: bold;
		text-align: center;
		opacity: 0.7;
	}
</style>
