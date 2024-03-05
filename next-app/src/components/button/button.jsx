import React from 'react';

const Button = ({ classNames = '', children, type, onClick, href, external, clickable, id, form = '' }) => {
	var custom_classes = classNames;
	switch (type) {
		case 'red':
			custom_classes += ' background-gradient-red';
			break;
		case 'yellow':
			custom_classes += ' bg-tq-yellow hover:bg-tq-yellow-500';
			break;
		case 'green':
			custom_classes += ' background-gradient-green';
			break;
		case 'blue':
			custom_classes += ' background-gradient';
			break;
		default:
			custom_classes += ' background-gradient';
			break;
	}

	if (href) {
		if (external) {
			return (
				// external means that the link is to a external website and will open in a new tab (target="_blank")
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
		// form is used to submit the associated form when the button is clicked
		<button className={custom_classes} id={id} form={form}>
			{children}
		</button>
	}
	else {
		return (
			// onclick is used to call the associated function when the button is clicked
			<button className={custom_classes} id={id} onClick={onClick} form={form}>
				{children}
			</button>
		);
	}
};

export default Button;
