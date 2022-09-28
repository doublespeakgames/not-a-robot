<script type="ts">
	import { fade } from 'svelte/transition';
	import Button from './Button.svelte';
	import Spinner from './Spinner.svelte';
	import captcha1 from '$lib/assets/captcha-1.png';
	import captcha2 from '$lib/assets/captcha-2.png';
	import captcha3 from '$lib/assets/captcha-3.png';

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
				return `One last chance, robot:`;
		}
	};

	const captcha = (attempt: number) => {
		switch (attempt) {
			case 1:
				return captcha1;
			case 2:
				return captcha2;
			case 3:
				return captcha3;
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
	<div class="image" style:--img={`url(${captcha(attempt)})`} />
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
		background-image: var(--img);
		background-size: cover;
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
