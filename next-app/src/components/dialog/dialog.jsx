import React, { useState } from 'react';

/**
 * Dialog component displays a dialog box with a title, message, and a button.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the dialog.
 * @param {string} props.message - The message displayed in the dialog.
 * @param {string} [props.buttonText='OK'] - The text displayed on the button.
 * @param {Function} [props.buttonOnClick=() => {}] - The function to be called when the button is clicked.
 * @param {boolean} [props.visible=false] - Determines whether the dialog is visible or hidden.
 * @param {string} [props.buttonColor="blue"] - The color of the button. Possible values are "red", "orange", "yellow", "green", "blue", "indigo", "purple", "pink".
 * @returns {JSX.Element} The rendered Dialog component.
 * @example
 * const title = "Title";
 * const message = "Message";
 * const buttonText = "Button";
 * const buttonOnClick = () => console.log("Button clicked");
 * const visible = true;
 * const buttonColor = "red";
 * return (
 *  <Dialog
 *   title={title}
 *   message={message}
 *   buttonText={buttonText}
 *   buttonOnClick={buttonOnClick}
 *   visible={visible}
 *   buttonColor={buttonColor}
 *  />
 * )
 */
const Dialog = ({ title, message, buttonText, buttonOnClick, buttonColor, onClose, visible }) => {
	title = title || '';
	message = message || '';
	buttonText = buttonText || 'OK';
	onClose = onClose || (() => { });
	buttonOnClick = buttonOnClick || onClose || (() => { });
	visible = visible || false;
	buttonColor = buttonColor || 'orange';

	const colorClasses = {
		red: 'bg-red-500',
		orange: 'bg-orange-500',
		yellow: 'bg-yellow-500',
		green: 'bg-green-500',
		blue: 'bg-blue-500',
		indigo: 'bg-indigo-500',
		purple: 'bg-purple-500',
		pink: 'bg-pink-500',
	};

	return (
		<>
			{visible && (
				<div
					className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
					onClick={onClose}
				>
					<div className="background-gradient-blue p-6 rounded-lg drop-shadow-[0_25px_50px_rgba(0,0,0,.5)]">
						<div
							className="absolute top-2 right-2 p-2 text-white hover:bg-red-500 rounded-lg cursor-pointer"
							onClick={buttonOnClick}
						>
							{/* close icon (the x at the top right corner of the dialog box) */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								{/* the path property is used to define the shape of the icon, in this case a cross */}
								{/* basically it defines the movements of the pen to draw the icon */}
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</div>
						<h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
						<p className="mb-4 text-white">{message}</p>
						<button className={`${colorClasses[buttonColor]} text-white px-4 py-2 rounded-md`} onClick={buttonOnClick}>
							{buttonText}
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default Dialog;
