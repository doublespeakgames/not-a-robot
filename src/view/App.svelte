<script type="ts">
	import Speak from './Speak.svelte';
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="content">
	<Speak />
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
	.content {
		padding: 40px;
		height: 100%;
	}
</style>
