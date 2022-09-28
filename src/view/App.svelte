<script type="ts">
	import Logo from './Logo.svelte';
	import NotARobot from './NotARobot.svelte';
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="content">
	<NotARobot />
</main>

<nav>
	<a href="https://www.doublespeakgames.com" target="_blank">
		<Logo />
	</a>
</nav>

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
	nav {
		width: 40px;
		position: absolute;
		bottom: 5px;
		left: 10px;
		line-height: 0;
		fill: none;
		stroke: #ccc;
	}
</style>
