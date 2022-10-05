<script type="ts">
	// @ts-nocheck
	import { browser } from '$app/environment';

	export let key = 'G-5WFQELNW0W';

	if (browser) {
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', key);
	}
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id={key}"></script>
</svelte:head>
