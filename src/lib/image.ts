export type RGBA = {
	r: number; // [0, 255]
	g: number; // [0, 255]
	b: number; // [0, 255]
	a: number; // [0, 255]
};

export type HSL = {
	h: number; // [0, 360]
	s: number;
	l: number;
};

export type HSV = {
	h: number;
	s: number;
	v: number;
};

export function* pixels(canvas: HTMLCanvasElement): Generator<RGBA, void, void> {
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		return;
	}
	const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
	for (let i = 3, len = data.length; i < len; i += 4) {
		yield { r: data[i - 3], g: data[i - 2], b: data[i - 1], a: data[i] };
	}
}

export const RGBToHSL = ({ r, g, b }: RGBA): HSL => {
	r /= 255;
	g /= 255;
	b /= 255;
	const l = Math.max(r, g, b);
	const s = l - Math.min(r, g, b);
	const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;
	return {
		h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
		s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
		l: (100 * (2 * l - s)) / 2
	};
};

export const RGBToHSV = ({ r, g, b }: RGBA): HSV => {
	r /= 255;
	g /= 255;
	b /= 255;
	const v = Math.max(r, g, b),
		n = v - Math.min(r, g, b);
	const h = n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
	return {
		h: 60 * (h < 0 ? h + 6 : h),
		s: v && (n / v) * 100,
		v: v * 100
	};
};
