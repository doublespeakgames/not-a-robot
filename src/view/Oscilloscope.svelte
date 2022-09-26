<script type="ts">
	export let data: Uint8Array;
	let canvas: HTMLCanvasElement;

	$: ctx = canvas?.getContext('2d');
	$: width = canvas?.width ?? 0;
	$: height = canvas?.height ?? 0;

	$: {
		if (ctx && data.length > 0) {
			ctx.clearRect(0, 0, width, height);
			//ctx.lineWidth = 2;
			ctx.beginPath();
			const sliceWidth = width / data.length;
			for (let i = 0, len = data.length, x = 0; i < len; i++) {
				const v = data[i] / 128.0;
				const y = (v * height) / 2;

				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}

				x += sliceWidth;
			}
			ctx.lineTo(canvas.width, canvas.height / 2);
			ctx.stroke();
		}
	}
</script>

<canvas class="osc" bind:this={canvas} />

<style>
	.osc {
		height: 100%;
		width: 100%;
	}
</style>
