# Frontend

## To setup and run the project:

```
cd next-app
npm i
npm run dev
```

# Landing Page

For landing page, we defined a new circle component and used it for different chapters.

## Assumptions

We assume that the missions are ordered and increase the level of difficulty. Up to now, the chapters are organized in 3 distinct level of difficulty:
- *easy*: all the missions that belongs to the "easy" difficulty level are organized and displayed inside the chapter 1
- *medium*: all the missions that belongs to the "medium" difficulty level are organized and displayed inside the chapter 2
- *hard*: all the missions that belongs to the "hard" difficulty level are organized and displayed inside the chapter 3

Clicking on "Chapter 1" button will navigate to the next page in which missions included in the chapter 1 will be shown.

# Mission

## Landing Page

Inside the Chapters you can find all the missions relevant to it, as expressed in the assumptions above, chapters are organized by difficulty so inside the chapter 1 the user will found all the missions that belongs to the difficulty level "easy", inside the chapter 2 the user will find missions about the difficulty level "medium" and so on.
Only when the user completes all the missions in a chapter will unlock further missions of next chapters and the landing page will updates automatically.

Inside the first chapter, for instance, we have first mission actived named as "Path Traversal" while other buttons are not clickable.
Clicking on "Path Traversal" button will navigate to the next page.

## Learning Page

In the learning page we are almost in the exercise page. To make the user learn before doing the exercise this page contains a description of the topic with a resource access that links to external resouces.

This make the user obtain all the information that they need to obtain a full knowledge on the exercise he will perform.

When the user is ready to start the mission/exercise then he can simply click on the Start Exercise button.

The structure of the learning page is static and the content is retrieved from the database using the ```getExerciseData``` function.
This function take as input the exercise name and return the exercise data. The  learning page markdown can be retrieved as follows:

```javascript
const missionContent = await getExerciseData("mission_1");
return (
		<div>
			{/* Use the LearningComponent with mission-specific content */}
			<LearningComponent {...missionContent.learning} />
		</div>
	);
```
The ```LearningComponent``` is a component that takes as input the markdown content and render it in the page.

## Exercise Page

The exercise page consists in two part that are draggable by the user to improve user experience and let the user be confortable with a dynamic interface. In the right we have the exercise realization while in the left we have the complete exercise description and quest.

### Drag and Drop

To implement the drag and drop functionality, we used the react-dnd library (https://react-dnd.github.io/react-dnd/about).
The library provides a set of React components that can be used to create drag and drop interfaces.
To drag and drop a item you have to click on the item, drag it to the desired location and drop it there.

### Score for DD missions

To evaluate the score that the user performs on a mission that consist in Drag and Drop blocks in the right position, we simply add the check on the correct solution and show the result in a popup that tells the user how good have performed in the mission. The score is calculated checking the number of blocks in the right position divided by the number of expected blocks in the right position. Depending on the score that the user has perform the user will recieve a different message in the popup to make understand a little bit what is his level.