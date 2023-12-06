import React from "react";
import Button from "../components/button/button";
// import SplitterLayout from "react-splitter-layout";
// import "react-splitter-layout/lib/index.css";
import { Splitter, SplitterPanel } from 'primereact/splitter';
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';
//import 'primereact/resources/primereact.min.css';

// M1Exercise Component
function M1Exercise({ switchPage }) {
  // Placeholder content for drag and drop and exercise explanation sections
  const dragAndDropSection = (
    <div className="p-4 text-white">
      {/* Your drag and drop content */}
      <h2>Drag and Drop Section</h2>
      {/* Placeholder for the drag and drop functionality */}
    </div>
  );

  const dragsList = (
    <div className="p-4 text-white">
      {/* List of drags */}
      <h2>Drags List</h2>
      {/* Placeholder for drags list */}
    </div>
  );

  const exerciseExplanation = (
    <div className="p-4 text-white">
      {/* Explanation of the exercise */}
      <h2>Exercise Explanation</h2>
      <p>Your explanation content here...</p>
    </div>
  );

  return (
    <>
      <Splitter className="h-3/4 border-4 m-2" gutterSize={10}>
        {/* Column for the exercise description */}
        <SplitterPanel className="flex flex-col border-r-4" minSize={20} size={40}>
          <div className="h-full px-2">{exerciseExplanation}</div>
        </SplitterPanel>
        {/* Right column for drag and drop */}
        <SplitterPanel className="border-l-4" minSize={20} size={60}>
          <Splitter layout="vertical" className="h-full ml-2" gutterSize={10}>
            <SplitterPanel className="border-b-4 w-full" minSize={20}>
              <div id="pane2_1" className="h-full">
                {dragAndDropSection}
              </div>
            </SplitterPanel>
            <SplitterPanel className="border-t-4 h-full" minSize={20}>
              <div id="pane2_2" className="h-full">
                {dragsList}
              </div>
            </SplitterPanel>
          </Splitter>
        </SplitterPanel>
      </Splitter>
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
