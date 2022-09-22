<script type="ts">
	import { roundToPlaces } from '$lib/number';
	import compass from '../store/compass';

	let width: number;

	$: cosVal = Math.cos(($compass * Math.PI) / 180) / 2 + 0.5;
	$: sinVal = Math.sin(($compass * Math.PI) / 180) / 2 + 0.5;
</script>

<div class="wrapper" bind:clientWidth={width}>
	<div
		class="compass"
		style:--radius={`${width / 2}px`}
		style:--rot={`${$compass}deg`}
		style:--cos={cosVal}
		style:--sin={sinVal}
	>
		<div class="dir n">N</div>
		<div class="dir e">E</div>
		<div class="dir s">S</div>
		<div class="dir w">W</div>
	</div>
	<div class="center" style:--clr-border="#aaa" />
</div>

<style>
	.wrapper {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20px 0;
	}
	.compass {
		line-height: 1;
		font-weight: bold;
		font-size: 38px;
		color: #666;
		height: 38px;
	}
	.dir {
		position: absolute;
		left: 50%;
		transform-origin: center 0 calc(-1 * var(--radius));
		transform: translate3d(-50%, 0, 0);
	}
	.n {
		transform: translate3d(-50%, 0, 0) rotate3d(0, 1, 0, calc(0deg + var(--rot)));
		opacity: var(--cos);
	}
	.s {
		transform: translate3d(-50%, 0, 0) rotate3d(0, 1, 0, calc(180deg + var(--rot)));
		opacity: calc(1 - var(--cos));
	}
	.e {
		transform: translate3d(-50%, 0, 0) rotate3d(0, 1, 0, calc(90deg + var(--rot)));
		opacity: calc(1 - var(--sin));
	}
	.w {
		transform: translate3d(-50%, 0, 0) rotate3d(0, 1, 0, calc(-90deg + var(--rot)));
		opacity: var(--sin);
	}
	.center {
		position: absolute;
		height: 100%;
		width: 2px;
		background-image: linear-gradient(
				0deg,
				var(--clr-border),
				var(--clr-border) 20%,
				transparent 20%,
				transparent 80%,
				var(--clr-border) 80%
			),
			none, none, none;
	}
</style>
