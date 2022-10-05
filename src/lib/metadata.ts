export type Metadata = {
	type: string;
	title: string;
	description: string;
	image: string;
	url: string;
	imageHeight: number;
	imageWidth: number;
};

export const toJsonLD = (data: Metadata): string =>
	`<script type='application/ld+json'>${JSON.stringify({
		'@context': 'http://schema.org',
		'@type': data.type,
		name: data.title,
		image: data.image,
		description: data.description
	})}</script>`;
