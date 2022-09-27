<script type="ts">
	import Compass from './Compass.svelte';
	import Trace from './Trace.svelte';
	import pentagram from '$lib/assets/pentagram.svg';

	export let oncomplete: () => void;
</script>

<div class="wrapper">
	<Compass />
	<Trace {oncomplete} guide={pentagram} />
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
