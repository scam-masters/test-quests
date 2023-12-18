"use client";
import React from "react";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import DragAndDropExercise from "@/components/DragAndDropExercise/page";
import ExerciseView from "@/components/exerciseView/view"

/* Firestore Data Retrivial */
import db from "../../firebase/index";
import { collection, getDocs } from "firebase/firestore"; 


function M1Exercise() {

	/* 
		getData is a function that retrieves dnd mission data 
		it takes as input the document id (e.g. "mission_1") 
		and returns an object with, as fields, the data of the mission
		
		Example:	 getDataDnD("mission_1")
	*/
	async function getDataDnD(doc_id) {
		try {
			const querySnapshot = await getDocs(collection(db, "dnd_exercises"));
	
			const filteredDocs = querySnapshot.docs.filter((doc) => doc.id === doc_id);
	
			if (filteredDocs.length === 1) {
				const exercisesData = {
					explanation_path: filteredDocs[0].data().explanation_path,
					options: filteredDocs[0].data().options,
				};
	
				console.log(exercisesData);
				return exercisesData;
			} else {
				console.error("Document not found or multiple documents found.");
				return null;
			}
		} catch (error) {
			console.error("Error getting data: ", error);
			throw error;
		}
	}

	/* Placeholder content for exercise explanation */
	const exerciseExplanation = (
		<div className="p-4 text-white">
			<h2>Website Structure</h2>
			<br></br>
			<p>
				Suppose we have a simple website structure with the following
				directories:
			</p>
			<ul>
				<li>
					{" "}
					- <b>/home/</b> (contains user home directories)
				</li>
				<li>
					{" "}
					- <b>/public/</b> (publicly accessible files)
				</li>
				<li>
					{" "}
					- <b>/server/</b> (server-related files)
				</li>
				<li>
					{" "}
					- <b>/admin/</b> (admin-related files)
				</li>
			</ul>
			<br></br>

			<ul>
				<pre>
					<li>/</li>
					<li>|-- home/</li>
					<li>| |-- user1/</li>
					<li>| |-- ...</li>
					<li>|</li>
					<li>|-- public/</li>
					<li>| |-- index.html</li>
					<li>| |-- about.html</li>
					<li>| |-- user_uploaded_file.txt</li>
					<li>| |-- ...</li>
					<li>|</li>
					<li>|-- server/</li>
					<li>| |-- secrets/</li>
					<li>|   |-- flag.txt</li>
					<li>|</li>
					<li>|-- index.html</li>
					<li>|-- about.html</li>
					<li>|-- contact.html</li>
					<li>|-- files.php</li>
				</pre>
			</ul>
			<br></br>
			<b>Target File:</b>
			<p>
				The sensitive file we want to access is located at:{" "}
				<b>/server/secrets/flag.txt</b>
			</p>
			<br></br>
			<p>
				<b>Website Description:</b>
			</p>
			<p>The website allows users to access certain public files.</p>
			<p>
				The website employs a simple mechanism to serve files based on user
				requests.
			</p>
			<p>
				The URL structure might look like this:{" "}
				<b>http://example.com/files.php?file=user_uploaded_file.txt</b>
			</p>
		</div>
	);

	return (
		<ExerciseView
			exerciseExplanation={exerciseExplanation}
			resource='https://owasp.org/www-community/attacks/Path_Traversal'
			Exercise={DragAndDropExercise}
			exerciseArguments={{}}
		/>
	)
}

export default M1Exercise;
