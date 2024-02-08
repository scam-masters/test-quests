const admin = require("firebase-admin")
const fs = require('node:fs/promises');
const { argv } = require('node:process');
const path = require('node:path');

var serviceAccount = require("./serviceAccountKey.json");

const app = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const dump = require("./" + argv[2]);
const collectionName = path.basename(argv[2], suffix = ".json");

(async function() {
	// for (const collectionName in dump) {
	const collection = dump[collectionName]
	// create collection
	const collectionRef = db.collection(collectionName)
	for (const docName in collection) {
		// create document with data
		const docRef = collectionRef.doc(docName)
		await docRef.set(collection[docName])
	}
	// }
})()
