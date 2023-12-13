import React from 'react';
import ReactMarkdown from 'react-markdown';
import Button from '../components/button/button';

const LearningComponent = ({
  title,
  subtitle,
  understandingPathTraversal,
  risksAndImpact,
  furtherResources,
  howToPlay,
  switchPage
}) => {
  return (
    <div className="text-white text-left">
      <div className="max-w-screen-md mx-auto mb-8 mt-8 p-4">
        <div className="text-center">
          <ReactMarkdown>{title}</ReactMarkdown>
          <ReactMarkdown>{subtitle}</ReactMarkdown>
        </div>
        <ReactMarkdown>{understandingPathTraversal}</ReactMarkdown>
        <ReactMarkdown>{risksAndImpact}</ReactMarkdown>
        <ReactMarkdown>{furtherResources}</ReactMarkdown>
        <ReactMarkdown>{howToPlay}</ReactMarkdown>
      </div>
      <div className="flex justify-between w-4/5 mx-auto mb-8">
        <Button onClick={() => switchPage('landing')} type='blue'>
          Go back to main page
        </Button>
        <Button href='https://owasp.org/www-community/attacks/Path_Traversal' type='green' external>
          Learn More
        </Button>
        <Button onClick={() => switchPage('m1exercise')} type='red'>
          Start Exercise
        </Button>
      </div>
    </div>
  );
};
// M1Learning Component
function M1Learning({ switchPage }) {
  // Define the content for Mission 1
  const missionContent = {
    title: '# **Welcome to Mission Number 1**',
    subtitle: "# It's time to learn, the rocket is starting...",
    understandingPathTraversal: `## **Understanding Path Traversal**

Path Traversal, also known as Directory Traversal, is a security vulnerability that allows an attacker to access files and directories that are outside the web root directory. This vulnerability occurs when user input is not properly sanitized and validated.`,

    risksAndImpact: `## **Risks and Impact**

- **1) Unauthorized Access:** Exploiting path traversal vulnerabilities can lead to unauthorized access to sensitive files, including configuration files, user data, or even system files.
- **2) Data Leakage:** Attackers can read and potentially modify files they shouldn’t have access to, compromising data integrity and confidentiality.
- **3) System Compromise:** In severe cases, path traversal can lead to full system compromise, enabling attackers to execute arbitrary code.`,

    preventionAndBestPractices: `## **Prevention and Best Practices**

- **1) Input Validation:** Always validate and sanitize user input to ensure it doesn’t contain path traversal sequences.
- **2) File Whitelisting:** Implement file whitelisting to restrict access to only necessary files and directories.
- **3) Use Security Libraries:** Leverage security libraries or frameworks that handle file operations securely.`,
    
    howToPlay:  `## **What you need to do?**

You will complete a drag and drop exercise to play with Path Traversal.

The score of the mission will be evaluated checking the correctness of the drags and drop that you will perform so play with your brain.
    `,

    resourcesLink: 'https://owasp.org/www-community/attacks/Path_Traversal',
    exerciseLink: '/m1-exercise',
  };

  return (
    <div>
      <LearningComponent {...missionContent} switchPage={switchPage}/>
      {/* Use the LearningComponent with mission-specific content */}
    </div>
  );
}

export default M1Learning;