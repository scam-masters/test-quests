import React from 'react';

const Button = ({ classNames = '', children, type, onClick, href, external, clickable, id, form = '' }) => {
	var custom_classes = classNames;
	switch (type) {
		case 'red':
			custom_classes += ' bg-tq-red hover:bg-tq-red-500';
			break;
		case 'yellow':
			custom_classes += ' bg-tq-yellow hover:bg-tq-yellow-500';
			break;
		case 'green':
			custom_classes += ' bg-tq-green hover:bg-tq-green-500';
			break;
		case 'blue':
			custom_classes += ' bg-tq-accent hover:bg-tq-secondary-500';
			break;
		default:
			custom_classes += ' bg-tq-accent hover:bg-tq-primary-500';
			break;
	}

	if (href) {
		if (external) {
			return (
				<a href={href} target="_blank" rel="noopener noreferrer">
					<button className={custom_classes + " w-full"} id={id}  >
						{children}
					</button>
				</a>
			);
		} else {
			return (
				<a href={href}>
					<button className={custom_classes + " w-full"} id={id}  >
						{children}
					</button>
				</a>
			);
		}
	} else if (clickable) {
		<button className={custom_classes} id={id} form={form}>
			{children}
		</button>
	}
	else {
		return (
			<button className={custom_classes} id={id} onClick={onClick} form={form}>
				{children}
			</button>
		);
	}
};

export default Button;
