export const roundToPlaces = (num: number, places: number): number => {
	const mod = Math.pow(10, places);
	return Math.round(num * mod) / mod;
};
