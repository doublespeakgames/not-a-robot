import { Firestore } from '@google-cloud/firestore';
import { json } from '@sveltejs/kit';

type SpokenRecord = {
	count: number;
};

const COLLECTION = 'spoken';
const DOC = 'singleton';

const db = new Firestore();

const getSpoken = async () => {
	const doc = await db.collection(COLLECTION).doc(DOC).get();
	return doc.exists ? (doc.data() as SpokenRecord).count : 0;
};

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
	return json(await getSpoken());
};

/** @type {import('./$types').RequestHandler} */
export const POST = async () => {
	const current = (await getSpoken()) + 1;
	await db.collection(COLLECTION).doc(DOC).set({ count: current });
	return json(current);
};
