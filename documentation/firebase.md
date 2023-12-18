# Firebase Documentation

## Access Firebase Console
To access the Firebase console, visit [Firebase Console](https://console.firebase.google.com/u/0/project/test-quests-a3712).

## Cloud Firestore

### Perform Queries

Performing queries in Cloud Firestore allows you to retrieve data from your database efficiently. The following steps illustrate a simple query:

#### Import Firestore for Data Retrieval

Import the necessary Firestore modules in your JavaScript code:

```javascript
import db from "../../firebase/index";
import { collection, getDocs } from "firebase/firestore"; 
```

#### Instantiate an Object to Get Documents from a Collection

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

Ensure to customize the data retrieval based on your specific document structure.
For more detailed information on Firestore queries, refer to the [official Firebase documentation on querying data](https://firebase.google.com/docs/firestore/query-data/queries?hl=en).