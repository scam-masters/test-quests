import React from 'react';
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


import Draggable from '../components/dnd/draggable'
import Fillable from '../components/dnd/fillable'

function DndExercise() {
	return (
		<DndProvider backend={HTML5Backend}>
			<p>Answer here: <Fillable />.</p>
			<div>
				<Draggable text='zio pera'/>
				<Draggable text='zio di tutte le pere'/>
			</div>
		</DndProvider>
	)
}

export default DndExercise
