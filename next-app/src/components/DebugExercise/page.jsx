"use client"

import { useState } from "react"

export default function DebugExercise({ text, selectables, solution, onScoreComputed }) {
    const [answers, setAnswers] = useState(Array(selectables.length).fill(false))

    function click(i) {
        setAnswers(prev => {
            let arr = Array.from(prev);
            arr[i] = !arr[i];
            return arr;
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        let count = 0
        for (let i = 0; i < answers.length; i++) {
            if (answers[i] == solution[i]) {
                count++;
            }
        }
        onScoreComputed(100 * count / answers.length);
    }

    let i = 0;
    let exercise = [];
    for (const [index, item] of selectables.entries()) {
        let unselectable = text.substring(i, item[0] - 1).replace(/\n/g, "<br>");
        let selectable = <button key={"selectable_" + index}
            className={answers[index] ? "bug-selected" : "bug-selectable"}
            onClick={click.bind(null, index)}>
            {text.substring(item[0], item[1])}
        </button>

        i = item[1];
        exercise.push(unselectable);
        exercise.push(selectable);
    }
    exercise.push(text.substring(i).replace(/\n/g, "<br>"));


    return (
        <>
            <form id='exercise-form' onSubmit={handleSubmit}>
            </form>
            {
                exercise
            }
        </>
    )
}