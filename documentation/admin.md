# Admin directory
Since changing the information contained in the Firestore database from the Firebase console may be complex, we created a series of script to dump the collections contained in the database, modify them locally, and then upload them to update the database.

## To Dump and Update the Database from the Repository

1. Use the following link to download the admin credentials: https://console.firebase.google.com/u/0/project/test-quests-a3712/settings/serviceaccounts/adminsdk

2. Move the file inside the `admin` directory

The first two actions have to be done just once. From the second time, you can perform only the next three steps:

3. Execute the `dump.js` script
    ```bash
    cd admin
    node dump.js
    ```

4. After the execution of this script, a json file for each collection will be downloaded inside the folder `admin/db`. Each of them will contain all the documents of the collection and the corresponding data. The changes made to these files will update the database instance

5. To update the database by uploading the modified documents, execute the `restore.js` script
    ```bash
    node restore.js
    ```
