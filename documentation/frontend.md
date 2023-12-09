# Frontend

To setup and run the project:
```
cd react
npm install
npm start
```

# Landing Page
For landing page, we defined a new circle component and used it for different missions.
For instance, we have first mission actived named as "Path Traversal" while other buttons are not clickable.
Clicking on "Path Traversal" button will navigate to the next page.

# Testing
Given that we are on landing page
When user click on "Path Traversal" button
Then user will be directed to the next page

Given that we are the Mission story page
When user click on Go Back to main page button
Then user should be redirected to main page


# Drag and Drop 
To implement the drag and drop functionality, we used the react-dnd library (https://react-dnd.github.io/react-dnd/about).
The library provides a set of React components that can be used to create drag and drop interfaces. 
To drag and drop a item you have to click on the item, drag it to the desired location and drop it there.