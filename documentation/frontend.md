# Frontend

## To setup and run the project:
```
cd react
npm install
npm start
```

## Drag and Drop (DD)

To implement the drag and drop functionality, we used the react-dnd library (https://react-dnd.github.io/react-dnd/about).
The library provides a set of React components that can be used to create drag and drop interfaces. 
To drag and drop a item you have to click on the item, drag it to the desired location and drop it there.

## Score for DD missions

To evaluate the score that the user performs on a mission that consist in Drag and Drop blocks in the right position, we simply add the check on the correct solution and show the result in a popup that tells the user how good have performed in the mission. The score is calculated checking the number of blocks in the right position divided by the number of expected blocks in the right position. Depending on the score that the user has perform the user will recieve a different message in the popup to make understand a little bit what is his level.