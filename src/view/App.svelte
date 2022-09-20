<script type="ts">
	import Trace from './Trace.svelte';
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="trace">
	<Trace />
</div>

<style>
	:global(html) {
		box-sizing: border-box;
		height: 100%;
	}
	:global(*, *::before, *::after) {
		box-sizing: inherit;
	}
	:global(body) {
		margin: 0;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.trace {
		padding: 40px;
		height: 100%;
	}
</style>
