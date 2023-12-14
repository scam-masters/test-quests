"use client";
import React, { useState } from "react";
import Button from "@/components/button/button";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { Dialog } from "primereact/dialog";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import DragAndDropExercise from "../DragAndDropExercise/page";
import Link from "next/link";

function M1Exercise() {
  const ExercisePoints = 50; // TODO: retrieve it from the database

  const [correctness, setCorrectness] = useState(0);
  const [visible_dialog, setVisibleDialog] = useState(false);

  /* Handle the score computing from D&DExercise.js */
  const handleCorrectnessComputed = (computedCorrectness) => {
    setCorrectness(computedCorrectness);
  };

  /* Show the dialog/popup with the score */
  const handleSubmit = () => {
    setVisibleDialog(true);
  };

  const handleCloseDialog = () => {
    setVisibleDialog(false);
  };

  /* Placeholder content for drag and drop and exercise explanation sections */
  const dragAndDropSection = (
    <div className="p-4 text-white">
      <DragAndDropExercise
        onScoreComputed={handleCorrectnessComputed}
      ></DragAndDropExercise>
    </div>
  );

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
    <>
      <Splitter className="h-3/4 border-4 m-2" gutterSize={10}>
        {/* Column for the exercise description */}
        <SplitterPanel
          className="flex flex-col border-r-4 overflow-y-auto scrollbar-hide"
          minSize={20}
          size={40}
        >
          <div className="h-full px-2">{exerciseExplanation}</div>
        </SplitterPanel>

        {/* Right column for drag and drop */}
        <SplitterPanel className="border-l-4" minSize={20} size={60}>
          <div id="pane2_1" className="h-full">
            {dragAndDropSection}
          </div>
        </SplitterPanel>
      </Splitter>

      {/* Dialog to display the correctness when the user fill all the blanks */}
      <Dialog
        header="Submit Results"
        visible={visible_dialog}
        className=" w-auto rounded-sm min-w-1/3"
        onHide={handleCloseDialog}
      >
        <div>
          {correctness === -1 && (
            <div>
              <p className="text-center mb-4 text-4xl">CHEATER!</p>
              <p className="text-center mb-4 text-xl">
                You need to fill all the blanks!
              </p>
            </div>
          )}
          {correctness === 100 && (
            <div className="flex justify-center ">
              <p className="text-center mb-8 text-4xl">
                {correctness}%
                <br/> 
                Congratulations!
                <br/> 
                <br/> 
                You have earned {ExercisePoints} points!
              </p>
            </div>
          )}
          {correctness < 100 && correctness >= 80 && (
             <div className="flex justify-center ">
             <p className="text-center mb-8 text-4xl">
                {correctness}%
                <br/> 
                You are almost there!
             </p>
           </div>
          )}
          {correctness < 80 && correctness >= 20 && (
             <div className="flex justify-center ">
             <p className="text-center mb-8 text-4xl">
                {correctness}%
                <br/> 
                Give it another chance!
             </p>
           </div>
          )}
          {correctness < 20 && correctness >= 0 && (
             <div className="flex justify-center ">
             <p className="text-center mb-8 text-4xl">
               {correctness}%  
                <br/> 
                You need more effort!
             </p>
           </div>
          )}
          <div className="flex justify-center mt-4">
            {correctness < 100 && (
              <Button type="green" onClick={handleCloseDialog}>
                Let&apos;s try again!
              </Button>
            )}
            {correctness === 100 && (
              <Button onClick={() => switchPage("landing")} type="blue">
                Continue
              </Button>
            )}
          </div>
        </div>
      </Dialog>

      <div className="flex justify-between mx-auto ml-4 mr-4">
        <Link href="/">
          <Button type="blue">
            Go back to main page
          </Button>
        </Link>
        <Button
          href="https://owasp.org/www-community/attacks/Path_Traversal"
          type="green"
          external
        >
          Learn More
        </Button>
        <Button type="red" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </>
  );
}

export default M1Exercise;
