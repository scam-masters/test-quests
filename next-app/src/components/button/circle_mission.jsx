import React from 'react';

const CircleMission = ({ children, type, onClick }) => {
	
	var custom_classes = '';
	switch (type) {
		case 'red':
			custom_classes = 'bg-tq-red hover:bg-tq-red-500';
			break;
		case 'yellow':
			custom_classes = 'bg-tq-yellow hover:bg-tq-yellow-500';
			break;
		case 'green':
			custom_classes = 'bg-tq-green hover:bg-tq-green-500';
			break;
		case 'blue':
			custom_classes = 'bg-tq-accent hover:bg-tq-secondary-500';
			break;
        case 'gradient':
            custom_classes = 'bg-gradient-to-r from-tq-yellow to-tq-green hover:from-tq-yellow hover:to-tq-red';
            break;
        case 'locked':
            custom_classes = 'bg-gradient-to-r from-tq-red to-tq-gray cursor-not-allowed';
            break;
        default:
			custom_classes = 'bg-tq-accent hover:bg-tq-primary-500';
			break;
	}
    custom_classes += ' text-tq-black font-bold py-20 px-10 rounded-full transition duration-200 ease-in-out hover:shadow-lg hover:scale-105 active:scale-95 active:shadow-md';
	return (
		<button className={custom_classes} onClick={onClick}>
			{children}
		</button>
	);
};

export default CircleMission;