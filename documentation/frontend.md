# Frontend
## Setup and run
To setup and run the project, run the following commands:
```bash
cd next-app
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

All the frontend code is contained inside the `next-app/src/app` and `next-app/src/components` directories.

## Website structure
The website landing page shows different storylines. Each storyline contains missions for a particular programmning language (and testing framework), e.g. Python (pytest), or Java (JUnit).

### Chapters
Missions are ordered by their difficulty. In particular, they are are organized in 3 distinct level of difficulty:
- *easy*: all the missions that belongs to the "easy" difficulty level are contained into Chapter 1
- *medium*: all the missions that belongs to the "medium" difficulty level are inside Chapter 2
- *hard*: all the missions that belongs to the "hard" difficulty level are displayed inside Chapter 3

When the player completes all the missions of a chapter, the next chapter is unlocked.

Chapters are retrieved inside the storyline page, using the `retrieveChapters` function. The function checks the player's progress from the database by looking at the difficulty of the missions they have unlocked. Based on that information, the storyline page is dynamically built, showing available and locked chapters.

Inside a chapter, each mission is represented with a circle. Missions have to be complete in the order they are presented, i.e., a mission is locked until the previous one is completed.
By clicking on an unlocked mission, the player can access the mission's learning page.

### Missions
#### Learning Page
This page contains a description of the topic and a brief recap of the concepts that the player needs to know to complete the mission. To provide the player further and more detailed information, the learning page also contains a _Learn more_ button that links to an external resource.

When the user is ready to start the mission/exercise then he can simply click on the _Start Exercise_ button.

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

#### Exercise Page
The exercise page consists in two sections displayed next to each other. The left one contains the exercise description, while the right one contains the actual exercise. 
Sections are draggable and their size can be rearranged to improve user experience.

This structure is defined inside the `ExerciseView` component. 

##### A special case: the Drag and Drop Exercise
Unlike all the other exercises, to implement the drag and drop functionality we used a library, the `react-dnd` library (https://react-dnd.github.io/react-dnd/about).

Drag and drop and multiple matching exercises are built using the `Answer` component exposed by the `dnd` module, which is the one component to define blocks.

```javascript
	// useDrag hook
	// https://react-dnd.github.io/react-dnd/docs/api/use-drag
	// drag only if the answer is not null
	const [{ opacity }, drag] = useDrag(
		() => ({
			type: 'answer',
			item: { id },
			collect: (monitor) => ({
				opacity: monitor.isDragging() ? 0.5 : 1
			}),
			end: (_item, monitor) => {
				if (monitor.didDrop()) {
					swap(id, monitor.getDropResult().id)
				}
			},
			canDrag: (_monitor) => {
				return text !== null
			}
		}),
		[text]
	)

	// useDrop hook
	// https://react-dnd.github.io/react-dnd/docs/api/use-drop
	// drop only if the target is an answer
	const [, drop] = useDrop(() => ({
		accept: "answer",
		drop: function () {
			return { id }
		}
	}))

	if (text === null) {
		// return a blank space where the answer will be dropped
		return (
			<span className={classesEmpty} ref={drop(ref)} style={{ opacity }}>___</span>
		)
	} else {
		// return the draggable answer
		return (
			<span className={custom_classes} ref={drag(drop(ref))} style={{ opacity }}>
				{text}
			</span>
		)
	}
```

The library provides a set of React components that can be used to create drag and drop interfaces.
To drag and drop a item you have to click on the item, drag it to the desired location and drop it there.

##### Correctness and score
To evaluate the score that the player performs on a mission, we compare the player's answers with the correct solution (retrieved from the database), and we show the result in a popup. The correctness is given by the percentage of the player's correct answers. A mission is passed when the player obtains a correctness that is equal or above a certain threshold. 

The correctness is computed on the basis of the exercise type, i.e., by the corresponding component (e.g., `DnDMmExercise`, `DndExercise`, `MultipleMatching`, etc.)

Depending on the correctness, the player recieves a different message in the popup, together with the obtained score (if the mission is passed). The score depends on the correctness, e.g., 100% correctness = full score = mission's points.

The score update, together with the unlock of a new chapter or the finish of a storyline, is performed by the  `handleCorrectnessComputed()` function defined inside the `ExerciseView` component, after the exercise is submitted and the correctness is computed. 

```javascript
	// This will be called once by the exercise when the player finishes
	const handleCorrectnessComputed = async (computedCorrectness) => {
		console.log("submitted")
		stopTimer()

		const correctness = Math.round(computedCorrectness)
		const missionScore = Math.round(exercisePoints * correctness / 100)

		await updateUserScore(missionId, missionScore, correctness, exerciseThreshold)

		setCorrectness(correctness);
		setMissionScore(missionScore);
		// if the user has passed the mission, update the badges and
		if (correctness >= exerciseThreshold) {
			// check if the user has unlocked the next chapter
			const unlock = await updateChapterUnlocking(missionId)
			// or finished the storyline
			const finishedStoryline = await checkStorylineCompletion(missionId)
			setUnlockNewChapter(unlock);
			setFinishedStoryline(finishedStoryline);
		}
		setVisibleDialog(true);
	};
```

The `updateUserScore`, `checkChapterCompletion`,functions are contained inside the `src/app/user_actions.js` file, while the `checkStorylineCompletion` function is defined into the `src/app/actions.js` file.

##### Update score
When a player submits a mission, the score they obtained is computed and it is updated on the database, using the `updateUserScore` function.

The function compares the current score with the previous score the player obtained on that mission, and updates it only if it is scrictly greater than the previous one.
The update consists in:
- *Updating the player's total score*, the one shown on the scoreboard, by subtracting the previous score and adding the new one;
- *Update the player's score for that mission* by replacing the old one;
- *Unlock the next mission*, only if it is the same storyline (otherwise the storyline is finished and nothing has to be done). This is done by inserting a new mission entry on the database document associated with the player. In this way, the next time the player loads the chapter page, the new mission is retrieved together with the previous ones, and it is shown as unlocked;
- *Check if the player has earned badges*, by checking how many missions of the same kind the player has completed (5 or 10 mission badge), or if they are the first player to achieve 100% correctness (first blood badge).

By unlocking the next mission, we are also performing the unlock of new chapters.

##### Complete a chapter
When the player submits a mission, the `checkChapterCompletion` function is called to check if a new chapter is unlocked and if the player has obtained a new badge (chapter completion badge).
This is done by comparing the difficulty and the storyline of the player's sumbitted mission with the next one. If they differ in some way, we check if the user already owns that badge, and, if not, we assign it. 

Note that this function does not unlock a new chapter: this action is automatically performed when the score is updated and the next mission is unlocked.

##### Complete a storyline
As happens for the chapter completion, the `checkStorylineCompletion` function is called whenever a mission is submitted. This function retrieves all the missions for the current storylines, and checks if the sumbitted one is the last. If so, it assigns a badge to the player (storyline completion badge).