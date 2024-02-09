"use client";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Answer from "@/components/dnd/answer";

export default function DndExercise({
  onScoreComputed,
  blocks,
  options,
  solution,
}) {
  // buld an array of nulls of size options.size
  let nulls = Array(solution.length).fill(null);

  // blanks + options to be filled
  options = nulls.concat(options);

  // initialize answers with options
  const [answers, setAnswers] = useState(options);

  // function to swap two elements in the answers array
  function swap(x, y) {
    setAnswers((prev) => {
      let a = Array.from(prev);
      let tmp = a[x];
      a[x] = a[y];
      a[y] = tmp;
      return a;
    });
  }

  function computeCorrectness(answers) {
    let count = 0;
    let missing = false;

    for (let i = 0; i < solution.length; i++) {
      if (solution[i] === answers[i]) count++;
      if (answers[i] === null) missing = true;
    }
    if (!missing) {
      return (count / solution.length) * 100;
    } else return -1; // return -1 to recognize wheter the user have not filled yet
  }

  // the score is now computed *only* when the user submit the form
  function onSubmit(e) {
    e.preventDefault();
    onScoreComputed(computeCorrectness(answers));
  }

  // build the draggable answers
  let draggableAnswers = answers.map((x, i) => {
    return <Answer key={i} id={i} text={x} swap={swap} />;
  });

  // function to parse the input and replace the blanks with the draggable answers
  function parseInput(blocks) {
    let res = Array(blocks.length).fill(null);

    for (let i = 0, blank = 0; i < blocks.length; i++) {
      if (blocks[i] === "") {
        res[i] = draggableAnswers[blank++];
      } else {
        res[i] = (
          <span
            key={"block_" + i}
            dangerouslySetInnerHTML={{ __html: blocks[i] }}
          ></span>
        );
      }
    }

    return res;
  }

  // HACK: other exercises use forms to manage the user inputs and here we do the same in order to know when the user presses the button.
  // In particular when the submit event fires we should compute the new score. Alternatives are likely possible but more convoluted
  return (
    <DndProvider backend={HTML5Backend}>
      <form id="exercise-form" onSubmit={onSubmit} />
      <p>Complete the exercise by draging the bloks into the blanks:</p>
      <br />
      <p>{parseInput(blocks)}</p>
      <p className="mt-5">Compose it starting from these blocks:</p>
      <div className="min-w-max grid grid-cols-4 gap-1">
        {draggableAnswers.slice(solution.length)}
      </div>
    </DndProvider>
  );
}
