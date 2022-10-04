export const increment = async () => {
	const response = await fetch('/spoken', { method: 'POST' });
	return response.json();
};
