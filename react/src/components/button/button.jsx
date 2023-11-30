import React from 'react';

const Button = ({ children, type, onClick }) => {
	
	var custom_classes = '';
	switch (type) {
		case 'red':
			custom_classes = 'bg-tq-red hover:bg-tq-red-500 text-tq-white font-bold py-2 px-4 rounded';
			break;
		case 'yellow':
			custom_classes = 'bg-tq-yellow hover:bg-tq-yellow-500 text-tq-white font-bold py-2 px-4 rounded';
			break;
		case 'green':
			custom_classes = 'bg-tq-green hover:bg-tq-green-500 text-tq-white font-bold py-2 px-4 rounded';
			break;
		case 'blue':
			custom_classes = 'bg-tq-accent hover:bg-tq-secondary-500 text-tq-white font-bold py-2 px-4 rounded';
			break;
		default:
			custom_classes = 'bg-tq-accent hover:bg-tq-primary-500 text-tq-white font-bold py-2 px-4 rounded';
			break;
	}
	return (
		<button className={custom_classes} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;