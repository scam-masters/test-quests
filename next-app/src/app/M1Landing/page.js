"use client"
import React from 'react';
import LearningComponent from '@/components/Learning/learning'

// M1Learning Component
function M1Learning() {
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

		howToPlay: `## **What you need to do?**

You will complete a drag and drop exercise to play with Path Traversal.

The score of the mission will be evaluated checking the correctness of the drags and drop that you will perform so play with your brain.
    `,

		resourceLink: 'https://owasp.org/www-community/attacks/Path_Traversal',
		exerciseLink: '/M1Exercise',
	};

	return (
		<div>
			<LearningComponent {...missionContent} />
			{/* Use the LearningComponent with mission-specific content */}
		</div>
	);
}

export default M1Learning;
