# Firestore Database
Players' and missions' data is stored inside a Firestore Database instance. Firestore is a NoSQL document-based data store, meaning that data is stored into documents identified by IDs. Documents that represent similar information can be grouped into logical collections, that do not enforce a particular structure (i.e., documents of the same collection can have different fields).

To make our code interact with the Firestore instance, we can use the following configuration ([next-app/src/firebase/index.js](https://github.com/scam-masters/test-quests/blob/main/next-app/src/firebase/index.js) file) 

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "test-quests-a3712.firebaseapp.com",
  projectId: "test-quests-a3712",
  storageBucket: "test-quests-a3712.appspot.com",
  messagingSenderId: "XXXXXXXXXXX",
  appId: "1:249502392786:web:6086acbbb9986197f5a80b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

## Collections
We decided to use two collections, one to store players' information, and one to store all the exercises' data.

### `exercises`
The `exercises` collection contains one document for each mission, identified by the mission id (`mission_[number]`).
All the documents contain some common fields used to retrieve data to dynamically build the various exercise pages:
- `name`: contains the mission's name
- `storyline`: indicates to which storyline the mission belongs, used to build storylines
- `difficulty`: indicates the mission's difficulty, used to build chapters
- `threshold`: percentage of correctness the player has to obtain to complete the mission
- `points`: maximum score the player obtains when completing the mission. The score is computed on the basis of the correctness, e.g., 100% = full score = mission's points
- `type`: indicates the mission's type (e.g., drag and drop, multiple selection, etc.)
- `kind`: represents the kind of testing the mission is about (E2E, Security Testing, Unit Testing, etc.)
- `learning`: map that contains the text and the resources of the mission's learning page 

Then, depending on the mission's type, the documents can contain different fields that contain specific information for the different mission structures. For example, a drag and drop mission's document contains the array of blocks that the player has to put in the right position, and an array called `solution` that represents the correct block order.

### `users`
The users collection contains one document for each player, that is created at registration time. The document is identified by the player's email, and contains the following information:
- `username`
- `avatar`: id of the avatar associated with the player
- `score`: player's total score, shown in the scoreboard
- `friends` and `friend_requests`: list of players' usernames that represent, respectively, the player's friends and the player's friend requests
- `badges`: list of the badges earned by the player
- `missions`: map of missions, used to track the player's progress. For each mission, we store the id, the obtained score, and the timestamp (used to compute the position in the scoreboard)

## Perform Queries
### Import Firestore modules
First of all, to perform queries we need to import the necessary Firestore modules in our JavaScript code:

```javascript
import {db} from "../../firebase/index";
import { collection, getDocs } from "firebase/firestore"; 
```

### Instantiate an Object to get documents from a collection

Create a query snapshot to retrieve documents from a specific collection:

```javascript
const querySnapshot = await getDocs(collection(db, <COLLECTION>));
```

Replace `<COLLECTION>` with the name of your Firestore collection.

#### Filter Documents

Optionally, you can filter documents based on specific criteria. In the example below, documents are filtered based on their ID:

```javascript
const filteredDocs = querySnapshot.docs.filter((doc) => doc.id === <YOUR_DOC_ID>);
```

Replace `<YOUR_DOC_ID>` with the specific ID you are looking for.

#### Retrieve Data

Retrieve data from the documents:

```javascript
const exercisesData = {
    your_field_1: yourDocs[<idx>].data().your_field_1,
    your_field_2: yourDocs[<idx>].data().your_field_2
};

return exercisesData;
```

Rertreive data from a collection for a specific document

```javascript
const docRef = doc(db, "cities", "SF");
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}
```

For more detailed information on Firestore queries, refer to the [official Firebase documentation on querying data](https://firebase.google.com/docs/firestore/query-data/queries?hl=en).

## Dump and Update database using the admin local directory
For more information, see the [admin.md](https://github.com/scam-masters/test-quests/blob/main/documentation/admin.md) documentation
