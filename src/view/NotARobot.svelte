<script type="ts">
	import type { ChangeEvent } from '$lib/event';
	import Checkbox from './Checkbox.svelte';
	import Spinner from './Spinner.svelte';
	import { fade, slide } from 'svelte/transition';
	import TextCaptcha from './TextCaptcha.svelte';
	import Pulse from './Pulse.svelte';
	import Speak from './Speak.svelte';
	import Ritual from './Ritual.svelte';
	import Epilogue from './Epilogue.svelte';

	const VERIFY_TIME = 2000; // ms

	let verifying = false;
	let locked = false;
	let enhanced = false;
	let step = 4;

	const completeStep = () => {
		step++;
	};

	const oncheck = (e: ChangeEvent) => {
		verifying = locked = e.currentTarget.checked;
		setTimeout(() => {
			verifying = false;
			enhanced = true;
		}, VERIFY_TIME);
	};
</script>

{#if step < 4}
	<div class="wrapper">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<div class="spacer">
				{#if verifying}
					<div class="spin" transition:fade={{ duration: 200 }}>
						<Spinner size={24} />
					</div>
				{:else}
					<div class="spin" transition:fade={{ duration: 200 }}>
						<Checkbox
							disabled={locked || verifying}
							checked={locked || verifying}
							onchange={oncheck}
						/>
					</div>
				{/if}
			</div>
			<div class="not-a-robot">I am not a robot</div>
		</label>
		{#if enhanced}
			<div class="enhanced" transition:slide>
				<div class="enhanced-label">Enhanced verification required</div>
				{#if step === 0}
					<TextCaptcha oncomplete={completeStep} />
				{:else if step === 1}
					<Pulse oncomplete={completeStep} />
				{:else if step === 2}
					<Ritual oncomplete={completeStep} />
				{:else if step === 3}
					<Speak oncomplete={completeStep} />
				{/if}
			</div>
		{/if}
	</div>
{:else}
	<Epilogue />
{/if}

<style>
	.wrapper {
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 20px 0;
	}
	.label {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 20px;
	}
	.enhanced {
		border-top: 1px solid #ccc;
		margin-top: 20px;
		padding: 20px 20px 0;
	}
	.enhanced-label {
		margin-bottom: 10px;
		font-weight: bold;
	}
	.spacer {
		height: 24px;
		width: 24px;
	}
	.spin {
		position: absolute;
		line-height: 0;
	}
</style>
