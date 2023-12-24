import Link from "next/link"
import ReactMarkdown from 'react-markdown';
import Button from '@/components/button/button';

export default function LearningComponent({
	resourceLink,
	exerciseLink,
	contentHTML,
}) {
	return (
		<div className="text-white text-left">
			<div className="flex justify-between w-4/5 mx-auto mb-8 mt-8">
				{contentHTML}
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
