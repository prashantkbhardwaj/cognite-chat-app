import React from 'react';
import styles from './modal.module.css';

const Modal = (props) => {
	const { isOpen, children } = props;
	if (!isOpen) return null;

	return (
		<div className={styles['modal-overlay']}>
			<div className={styles['modal-content']}>{children}</div>
		</div>
	);
};

export default Modal;
