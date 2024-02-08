const admin = require("firebase-admin")
const fs = require('node:fs/promises');

var serviceAccount = require("./serviceAccountKey.json");

const app = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const docRef = db.collection('exercises').doc('mission_1');

(async function() {
	const dump = {}

	const collections = await db.listCollections();

	for (const col of collections) {
		dump[col.id] = { }
		const docs = await col.listDocuments()
		for (const doc of docs) {
			dump[col.id][doc.id] = await doc.get().then(x=>x.data())
		}
	}

	await fs.writeFile("./db_dump.json", JSON.stringify(dump))
})()

