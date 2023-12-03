import React from 'react';
import Button from '../components/button/button';

// M1Exercise Component
function M1Exercise({ switchPage }) {
  const handleGoBack = () => {
    switchPage('landing');
  };

  // Placeholder content for drag and drop and exercise explanation sections
  const dragAndDropSection = (
    <div>
      {/* Your drag and drop content */}
      <h2>Drag and Drop Section</h2>
      {/* Placeholder for the drag and drop functionality */}
    </div>
  );

  const exerciseExplanation = (
    <div>
      {/* Explanation of the exercise */}
      <h2>Exercise Explanation</h2>
      <p>
        Your explanation content here...
      </p>
    </div>
  );

  return (
    <div className='exercise-content'>
      <div style={{ textAlign: 'left', margin: '20px' }}>
        <Button onClick={handleGoBack} type='blue'>
          Go back to main page
        </Button>
      </div>
      <div className='drag-and-drop-section'>
        {dragAndDropSection}
      </div>
      <div className='exercise-explanation'>
        {exerciseExplanation}
      </div>
    </div>
  );
}

export default M1Exercise;
