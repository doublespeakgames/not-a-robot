<script type="ts">
	import NotARobot from './NotARobot.svelte';
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="content">
	<NotARobot />
</main>

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
		overflow: hidden;
	}
	.content {
		padding: 30px;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
