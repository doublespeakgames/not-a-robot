<script type="ts">
	let width: number;
	let height: number;
	let points: Array<[number, number]> = [];
	const onmove = (e: PointerEvent) => {
		if (e.buttons !== 1) {
			return;
		}
		points = [...points, [e.offsetX, e.offsetY]];
	};
	const ondown = () => {
		points = [];
	};

	$: path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x},${y}`).join(' ');
</script>

<div
	class="wrapper"
	bind:clientHeight={height}
	bind:clientWidth={width}
	on:pointerdown={ondown}
	on:pointermove={onmove}
>
	{#if points.length > 0}
		<svg class="svg" viewBox={`0 0 ${width} ${height}`}>
			<path d={path} />
		</svg>
	{/if}
</div>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
		background: blue;
		opacity: 0.5;
		touch-action: none;
		position: relative;
	}
	.svg {
		width: 100%;
		height: 100%;
		fill: none;
		stroke: black;
		stroke-width: 10;
	}
</style>
