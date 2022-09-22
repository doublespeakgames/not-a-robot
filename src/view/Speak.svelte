<script type="ts">
	import audio from '../store/audio';

	let canvas: HTMLCanvasElement;
	$: ctx = canvas?.getContext('2d');
	$: width = canvas?.width ?? 0;
	$: height = canvas?.height ?? 0;

	$: {
		if (ctx && $audio.length > 0) {
			ctx.clearRect(0, 0, width, height);
			//ctx.lineWidth = 2;
			ctx.beginPath();
			const sliceWidth = width / $audio.length;
			for (let i = 0, len = $audio.length, x = 0; i < len; i++) {
				const v = $audio[i] / 128.0;
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

<div class="wrapper">
	<canvas class="osc" bind:this={canvas} />
</div>

<style>
	.wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.osc {
		position: relative;
		display: flex;
		height: 200px;
		width: 100%;
	}
</style>
