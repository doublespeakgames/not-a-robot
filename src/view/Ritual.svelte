<script type="ts">
	import Compass from './Compass.svelte';
	import Trace from './Trace.svelte';

	export let oncomplete: () => void;
</script>

<div class="wrapper">
	<Compass />
	<Trace {oncomplete} />
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
