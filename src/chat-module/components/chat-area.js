import React, { useEffect, useRef } from 'react';
import styles from '../chat.module.css';
import {
	collection,
	Timestamp,
	updateDoc,
	getDocs,
	doc,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const ChatArea = (props) => {
	const { selectedChat, currentUser, chatRef, updateMessages, messages } =
		props;
	const inputRef = useRef(null);
	const messagesEndRef = useRef(null);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const fetchData = async (newMessage) => {
		try {
			const querySnapshot = await getDocs(collection(db, 'messages'));
			const dataList = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			const filteredData = dataList.filter(
				(item) =>
					item.players.includes(selectedChat?.userId) &&
					item.players.includes(currentUser?.userId),
			);
			const prevMessages = messages.length ? messages : [];
			prevMessages.push({
				text: newMessage,
				userId: currentUser?.userId,
				userName: currentUser?.userName,
				timestamp: Timestamp.now(),
			});
			await updateDoc(doc(db, 'messages', filteredData[0].id), {
				messages: prevMessages,
			});
			updateMessages([...prevMessages]);
		} catch (error) {
			console.error('Error fetching data: ', error);
		}
	};

	const handleKeyDown = async (e) => {
		if (e.key === 'Enter') {
			const newMessage = e.target.value;
			if (newMessage.trim()) {
				if (chatRef) {
					const prevMessages = chatRef ? messages : [];
					prevMessages.push({
						text: newMessage,
						userId: currentUser?.userId,
						userName: currentUser?.userName,
						timestamp: Timestamp.now(),
					});
					await updateDoc(doc(db, 'messages', chatRef.id), {
						messages: prevMessages,
					});
					updateMessages([...prevMessages]);
				} else {
					fetchData(newMessage);
				}
				inputRef.current.value = '';
			}
		}
	};

	return (
		<div>
			{!selectedChat ? (
				<div className={styles['empty-chat-text']}>
					Click on an user to start chatting!
				</div>
			) : (
				<>
					<div className={styles['chat-area-head']}>
						{selectedChat?.userName}
					</div>
					<div className={styles['chat-area-wrapper']}>
						{messages?.map((item) => (
							<div
								key={item.timestamp}
								className={
									currentUser.userId === item.userId
										? styles['sender-text']
										: styles['receiver-text']
								}
							>
								{item.text}
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
					<div className={styles['bottom-input-area']}>
						<input
							ref={inputRef}
							onKeyDown={handleKeyDown}
							className={styles['input-box']}
							type='text'
							placeholder='Type here'
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default ChatArea;
