# Firebase Documentation

## Admin Console
The website is managed through the Firebase Console, that allows to define authentication methods, manage users, and deploy the website so it can be accessed via a public link. To access the Firebase console, visit [this link](https://console.firebase.google.com/u/0/project/test-quests-a3712).

To make our code interact with the Firebase Console, all we need is a simple configuration file ([next-app/src/firebase/index.js](https://github.com/scam-masters/test-quests/blob/main/next-app/src/firebase/index.js))
```javascript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "test-quests-a3712.firebaseapp.com",
  projectId: "test-quests-a3712",
  storageBucket: "test-quests-a3712.appspot.com",
  messagingSenderId: "XXXXXXXXXXX",
  appId: "1:249502392786:web:6086acbbb9986197f5a80b"
};

const app = initializeApp(firebaseConfig);
```

### Authentication and session management
The firebase console allows to choose for the following authentication methods:
- Native provider, i.e., email and password (choosen one)
- External providers (Google, Apple, GitHub, Microsoft, etc.)

Firebase automatically manages authentication and session tokens. All we have to do is import the Firebase javascript modules in our code.


#### Registration
To register a new user, we can use the `getAuth()` and the `createUserWithEmailAndPassword()` methods provided from the `firebase/auth` module. In particular, with the following few simple lines of code we are able to register a new user using email and password.

```javascript
import { app } from "@/firebase/index";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(app);
await createUserWithEmailAndPassword(
  auth,
  email,
  password
);
```

#### Login and session management
As for registration, login can be easily implemented using the `signInWithEmailAndPassword()` method.

```javascript
import { app } from "@/firebase/index";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

try {
  await signInWithEmailAndPassword(getAuth(app), email, password)
  router.push("/")
} catch (error) {
  switch (error.code) {
    case 'auth/invalid-credential':
      setError("Invalid e-mail or password.")
      break;
    default:
      setError(error.message)
      break;
  }
}
```
To check if a session exists, for example at the beginning of pages accessible only to logged-in users, we can use the `getAuth()` function:

```javascript
import { getAuth } from "firebase/auth";

getAuth().onAuthStateChanged(user => {
  if (user)
    // Session exists, user is authenticated
  else
    router.push("/login") // Session not found, redirect to login page
});
```

### Deployment
The website is deployed and publicly accessible at this link: [https://test-quests-a3712.web.app](https://test-quests-a3712.web.app)

To deploy the website we set up a GitHub Action that is automatically executed every time some commits are pushed on the `production` branch:

```yaml
name: Deploy to Firebase Hosting
'on':
  workflow_dispatch:
  push:
    branches:
      - production
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: cd next-app && npm i && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_TEST_QUESTS_A3712 }}'
          channelId: live
          projectId: test-quests-a3712
          entryPoint: ./next-app
        env:
          FIREBASE_CLI_EXPERIMENTS: webframeworks
```


