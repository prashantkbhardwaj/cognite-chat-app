import React from 'react';
import styles from './button.module.css';

const SIZE_TYPES = ['small', 'large', 'default'];

const Button = (props) => {
	const { size, block } = props;

	return (
		<button
			{...props}
			style={block ? { width: '100%' } : { width: 'fit-content' }}
			className={
				size && SIZE_TYPES.includes(size)
					? [styles['button-wrapper'], styles[size]].join(' ')
					: [styles['button-wrapper'], styles['default']].join(' ')
			}
		>
			{props.children}
		</button>
	);
};

export default Button;
