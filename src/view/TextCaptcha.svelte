<script type="ts">
	import { fade } from 'svelte/transition';
	import Button from './Button.svelte';
	import Spinner from './Spinner.svelte';

	const VERIFY_TIME = 1000;
	const ATTEMPTS = 3;

	export let oncomplete: () => void;

	let inputText = '';
	let verifying = false;
	let attempt = 1;

	const labelText = (attempt: number) => {
		switch (attempt) {
			case 1:
				return 'Type the characters that you see below:';
			case 2:
				return 'Nope, try again:';
			case 3:
				return `Are you sure you're not a robot?`;
		}
	};

	const submit = (e: SubmitEvent) => {
		e.preventDefault();
		verifying = true;
		setTimeout(() => {
			verifying = false;
			inputText = '';
			if (++attempt > ATTEMPTS) {
				oncomplete();
			}
		}, VERIFY_TIME);
	};
</script>

<form class="wrapper" on:submit={submit}>
	<div class="label">{labelText(attempt)}</div>
	<div class="image">TODO</div>
	<input
		type="text"
		required
		class="input"
		placeholder="Answer here"
		value={inputText}
		disabled={verifying}
		on:change={(e) => (inputText = e.currentTarget.value)}
	/>
	<div class="verify">
		{#if verifying}
			<div class="spin" transition:fade={{ duration: 200 }}>
				<Spinner size={30} />
			</div>
		{/if}
		<Button type="submit" disabled={verifying}>Verify</Button>
	</div>
</form>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.image {
		border: 1px solid;
		aspect-ratio: 4/1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.input {
		padding: 5px 10px;
	}
	.verify {
		align-self: flex-end;
		position: relative;
	}
	.spin {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
