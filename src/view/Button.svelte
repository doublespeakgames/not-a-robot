<script type="ts">
	export let onclick = () => {};
	export let disabled = false;
	export let type = 'button';
</script>

<button on:click={onclick} class="button" {disabled} {type}>
	<slot />
</button>

<style>
	.button {
		padding: 10px 20px;
	}
</style>
