export type RingBuffer<T> = {
	push: (val: T) => void;
	length: () => number;
	[Symbol.iterator]: () => Iterator<T>;
};

export default <T>(size: number): RingBuffer<T> => {
	let head = 0;
	let tail = -1;
	const data: Array<T> = new Array(size);

	const push = (val: T) => {
		const newTail = (tail + 1) % size;
		if (newTail === head && tail >= 0) {
			head = (head + 1) % size;
		}
		tail = newTail;
		data[tail] = val;
	};

	const length = () => (tail < 0 ? 0 : tail >= head ? tail - head + 1 : size - (head - tail) + 1);

	function* iterator() {
		const len = length();
		for (let i = 0; i < len; i++) {
			yield data[(head + i) % size];
		}
	}

	return {
		push,
		length,
		[Symbol.iterator]: () => iterator()
	};
};
