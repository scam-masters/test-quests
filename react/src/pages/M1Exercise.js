import React from "react";
import Button from "../components/button/button";

// M1Exercise Component
function M1Exercise({ switchPage }) {

  // Placeholder content for drag and drop and exercise explanation sections
  const dragAndDropSection = (
    <div className="p-4 h-full">
      {/* Your drag and drop content */}
      <h2>Drag and Drop Section</h2>
      {/* Placeholder for the drag and drop functionality */}
    </div>
  );

  const dragsList = (
    <div className="p-4 h-full">
      {/* List of drags */}
      <h2>Drags List</h2>
      {/* Placeholder for drags list */}
    </div>
  );

  const exerciseExplanation = (
    <div className="p-4 h-full">
      {/* Explanation of the exercise */}
      <h2>Exercise Explanation</h2>
      <p>Your explanation content here...</p>
    </div>
  );

  return (
    <>
      <div className="flex h-3/4">
        {/* Column for the exercise description*/}
        <div className="px-2 flex-1 rounded overflow-hidden shadow-2xl mt-2">
          <div className="bg-white flex-1 rounded flex flex-col h-full">
            {exerciseExplanation}
          </div>
        </div>
        {/* Right column for drag and drop */}
        <div className="w-1/2 px-2 flex flex-col overflow-hidden shadow-lg mt-2">
          <div className="bg-white rounded h-1/2 border-b">
            {dragAndDropSection}
          </div>
          <div className="mt-2 bg-white rounded h-1/2">{dragsList}</div>
        </div>
      </div>
      <div className="flex justify-between mt-2 px-8">
        <Button onClick={() => switchPage("landing")} type="blue">
          Go back to main page
        </Button>
        <Button
          href="https://owasp.org/www-community/attacks/Path_Traversal"
          type="green"
          external
        >
          Learn More
        </Button>
        <Button type="red">Submit</Button>
      </div>
    </>
  );
}

export default M1Exercise;
