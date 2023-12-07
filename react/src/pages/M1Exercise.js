import React from "react";
import Button from "../components/button/button";
// import SplitterLayout from "react-splitter-layout";
// import "react-splitter-layout/lib/index.css";
import { Splitter, SplitterPanel } from 'primereact/splitter';
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css';
//import 'primereact/resources/primereact.min.css';

import DragAndDropExercise from './DragAndDropExercise';

// M1Exercise Component
function M1Exercise({ switchPage }) {
  // Placeholder content for drag and drop and exercise explanation sections
  const dragAndDropSection = (
    <div className="p-4 text-white">
      {/* Your drag and drop content */}
      {/* Placeholder for the drag and drop functionality */}
      <DragAndDropExercise></DragAndDropExercise>
    </div>
  );

  const exerciseExplanation = (
    <div className="p-4 text-white">
      {/* Explanation of the exercise */}
      <h2>Website Structure</h2>
      <br></br>
      <p>Suppose we have a simple website structure with the following directories:</p>
      <ul>
        <li> - <b>/home/</b> (contains user home directories)</li>
        <li> - <b>/public/</b> (publicly accessible files)</li>
        <li> - <b>/server/</b> (server-related files)</li>
        <li> - <b>/admin/</b> (admin-related files)</li>
      </ul>
      <br></br>

      <ul>
        <pre>
        <li>/</li>
        <li>|-- home/</li>
        <li>|   |-- user1/</li>
        <li>|   |-- ...</li>
        <li>|</li>
        <li>|-- public/</li>
        <li>|   |-- index.html</li>
        <li>|   |-- about.html</li>
        <li>|   |-- user_uploaded_file.txt</li>
        <li>|   |-- ...</li>
        <li>|</li>
        <li>|-- server/</li>
        <li>|   |-- secrets/</li>
        <li>|       |-- flag.txt</li>
        <li>|</li>
        <li>|-- index.html</li>
        <li>|-- about.html</li>
        <li>|-- contact.html</li>
        <li>|-- files.php</li>
        </pre>
      </ul>
      <br></br>
      <b>Target File:</b>
      <p>The sensitive file we want to access is located at: <b>/server/secrets/flag.txt</b></p>
      <br></br>
      <p><b>Website Description:</b></p>
      <p>The website allows users to access certain public files.</p>
      <p>The website employs a simple mechanism to serve files based on user requests.</p>
      <p>The URL structure might look like this: <b>http://example.com/files.php?file=user_uploaded_file.txt</b></p>
    </div>
  );

  return (
    <>
      <Splitter className="h-3/4 border-4 m-2" gutterSize={10}>
        
        {/* Column for the exercise description */}
        <SplitterPanel className="flex flex-col border-r-4 overflow-y-auto scrollbar-hide" minSize={20} size={40}>
          <div className="h-full px-2">{exerciseExplanation}</div>
        </SplitterPanel>

        {/* Right column for drag and drop */}
        <SplitterPanel className="border-l-4" minSize={20} size={60}>
          <div id="pane2_1" className="h-full">
            {dragAndDropSection}
          </div>
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
