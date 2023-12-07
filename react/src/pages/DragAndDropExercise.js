import React from 'react';
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


import Draggable from '../components/dnd/draggable'
import Fillable from '../components/dnd/fillable'

function DndExercise() {
	return (
		<DndProvider backend={HTML5Backend}>
		<p>The query you have to make is:</p>
		<Fillable />
		<p className='mt-5'>Compose it starting from these blocks:</p>
		<div className="min-w-max grid grid-cols-4 gap-1">
			<Draggable text="?" />
			<Draggable text="secrets/" />
			<Draggable text="../" />
			<Draggable text="flag.txt" />
			<Draggable text="file=" />
			<Draggable text="../" />
			<Draggable text="files.php" />
			<Draggable text="server/" />
		</div>

		</DndProvider>
	)
}

export default DndExercise
