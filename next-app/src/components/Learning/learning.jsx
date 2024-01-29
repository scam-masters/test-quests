import Link from "next/link"
import Button from '@/components/button/button';

export default function LearningComponent({
	resourceLink,
	exerciseLink,
	chapterLink,
	contentHTML,
}) {
	return (
		<div className="text-white text-left">
			<div className="flex justify-between w-4/5 mx-auto mb-8 mt-8">
				{contentHTML}
			</div>
			<div className="grid grid-cols-3 justify-between w-4/5 mx-auto mb-8">
				<Link href={chapterLink}>
					<Button type='blue' id="back_to_main">
						Go back to chapter page
					</Button>
				</Link >
				<div className="flex justify-center">
					<Button href={resourceLink} type='green' id="learn_more" external>
						Learn More
					</Button>
				</div>
				<div className="flex justify-end">
					<Button href={exerciseLink} type='red' id="start_exercise">
						Start Exercise
					</Button>
				</div>
			</div>
		</div >
	);
};
