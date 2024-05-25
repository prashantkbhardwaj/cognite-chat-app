import React from 'react';
import Button from '../../shared-components/button';
import styles from '../chat.module.css';

const Sidebar = (props) => {
	const { data, logout, selectChat, selectedChat } = props;

	return (
		<div className={styles['sidebar']}>
			<div className={styles['sidebar-head']}>
				<div>Chats</div>
				<Button onClick={logout} size='small'>
					Logout
				</Button>
			</div>
			<div className={styles['chat-cards-list']}>
				{data?.map((item) => (
					<div
						onClick={() => selectChat(item)}
						key={item.userId}
						className={
							selectedChat?.userId === item.userId
								? styles['chat-card-selected']
								: styles['chat-card']
						}
					>
						{item.userName}
					</div>
				))}
			</div>
		</div>
	);
};

export default Sidebar;
