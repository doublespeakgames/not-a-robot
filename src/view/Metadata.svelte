<script type="ts">
	import { toJsonLD, type Metadata } from '$lib/metadata';
	export let data: Metadata;
</script>

<meta property="og:type" content={data.type} />
<meta property="og:image" content={data.image} />
<meta property="og:image:width" content={String(data.imageWidth)} />
<meta property="og:image:height" content={String(data.imageHeight)} />
<meta property="og:title" content={data.title} />
<meta property="og:description" content={data.description} />
<meta property="og:url" content={data.url} />
{@html toJsonLD(data)}
