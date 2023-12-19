import Link from "next/link"
import ReactMarkdown from 'react-markdown';
import Button from '@/components/button/button';

export default function LearningComponent({
	title,
	subtitle,
	understandingPathTraversal,
	risksAndImpact,
	howToPlay,
	resourceLink,
	exerciseLink,
}) {
	return (
		<div className="text-white text-left">
			<div className="max-w-screen-md mx-auto mb-8 mt-8 p-4">
				<div className="text-center">
					<ReactMarkdown>{title}</ReactMarkdown>
					<ReactMarkdown>{subtitle}</ReactMarkdown>
				</div>
				<ReactMarkdown>{understandingPathTraversal}</ReactMarkdown>
				<ReactMarkdown>{risksAndImpact}</ReactMarkdown>
				<ReactMarkdown>{howToPlay}</ReactMarkdown>
			</div>
			<div className="flex justify-between w-4/5 mx-auto mb-8">
				<Link href="/">
					<Button type='blue'>
						Go back to main page
					</Button>
				</Link >
				<Button href={resourceLink} type='green' external>
					Learn More
				</Button>
				<Button href={exerciseLink} type='red'>
					Start Exercise
				</Button>
			</div>
		</div >
	);
};
