import React from 'react';

const Button = ({ children, type, onClick, href, external, clickable }) => {
	
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
		default:
			custom_classes = 'bg-tq-accent hover:bg-tq-primary-500';
			break;
	}
	custom_classes += ' text-tq-white font-bold py-2 px-4 rounded-full transition duration-200 ease-in-out hover:shadow-lg hover:scale-105 active:scale-95 active:shadow-md';
	if (href) {
		if (external) {
		  return (
			<a href={href} className={custom_classes} target="_blank" rel="noopener noreferrer">
			  {children}
			</a>
		  );
		} else {
		  return (
			<a href={href} className={custom_classes}>
			  {children}
			</a>
		  );
		}
	} else if(clickable){
		<button className={custom_classes}>
			{children}
		</button>
	} 
	else {
		return (
		  <button className={custom_classes} onClick={onClick}>
			{children}
		  </button>
		);
	}
};

export default Button;