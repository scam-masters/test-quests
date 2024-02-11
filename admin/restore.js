const admin = require("firebase-admin")
const { argv } = require('node:process');

async function restore(db, dump) {
	console.log(dump)
	for (const collectionName in dump) {
		console.log(collectionName)
		const collection = dump[collectionName]
		// create collection
		const collectionRef = db.collection(collectionName)
		for (const docName in collection) {
			// create document with data
			const docRef = collectionRef.doc(docName)
			await docRef.set(collection[docName])
		}
	}
}
module.exports = restore

// if top level
if (require.main === module) {
	const serviceAccount = require("./serviceAccountKey.json");
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount)
	});
	const db = admin.firestore();
	const dump = require("./" + argv[2]);
	restore(db, dump)
}
