# Firestore Database Collections

## ```dnd_exercises```
- ```explanation```: explanation in html
- ```blocks```: blocks showed to the user, either to be filled ("") or hinted to user (whatever else) 
- ```options```: blocks available to the user 
- ```solutions```: correct order of options

## ```debug_exercises```
- ```text```: A string that represents the text that the user will interact with.
- ```selectables```: An array of tuples, where each tuple represents the start and end indices of a selectable part in the text.
- ```solution```: An array of boolean values that represent the correct answers. Each boolean corresponds to a selectable part in the text.
- ```onScoreComputed```: A callback function that is called when the user submits their answers. The function is called with one argument: the score computed based on the user's answers and the solution.
