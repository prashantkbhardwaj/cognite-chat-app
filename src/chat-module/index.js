import React, { useEffect, useRef, useState } from 'react';
import styles from './chat.module.css';
import Sidebar from './components/sidebar';
import ChatArea from './components/chat-area';
import Button from '../shared-components/button';
import Modal from '../shared-components/modal';
import { Timestamp, addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ChatModule = () => {
	const localItem = window.localStorage.getItem('USER');
	const user = localItem ? JSON.parse(localItem) : null;
	const [userModal, setUserModal] = useState(false);
	const [errorText, setErrorText] = useState(null);
	const [data, setData] = useState(null);
	const [selectedChat, setSelectedChat] = useState(null);
	const [chatRef, setChatRef] = useState(null);
	const [messages, setMessages] = useState([]);
	const userIdRef = useRef(null);
	const userNameRef = useRef(null);

	useEffect(() => {
		if (!user) {
			setUserModal(true);
		} else {
			fetchUsers();
		}
	}, []);

	const closeModal = () => {
		fetchUsers();
		const user = {
			userId: userIdRef.current.value,
			userName: userNameRef.current.value,
		};
		window.localStorage.setItem('USER', JSON.stringify(user));
		userIdRef.current.value = '';
		userNameRef.current.value = '';
		if (errorText) setErrorText(null);
		setUserModal(false);
	};

	const fetchUsers = async () => {
		try {
			const querySnapshot = await getDocs(collection(db, 'users'));
			const dataList = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setData(dataList);
			return dataList;
		} catch (error) {
			console.error('Error fetching data: ', error);
		}
	};

	const addUser = async () => {
		const userId = userIdRef.current.value;
		const userName = userNameRef.current.value;
		await addDoc(collection(db, 'users'), {
			userId: userId,
			userName: userName,
			timestamp: Timestamp.now(),
		});
		closeModal();
	};

	const handleInputChange = (e, type) => {
		if (type === 'id') {
			userIdRef.current.value = e.target.value;
		} else {
			userNameRef.current.value = e.target.value;
		}
	};

	const startChat = () => {
		const userId = userIdRef.current.value.toLowerCase();
		const userName = userNameRef.current.value.toLowerCase();
		if (!userId || !userName) {
			return setErrorText('Fields cannot be empty!');
		}
		fetchUsers().then((resp) => {
			if (resp && resp.length) {
				const filteredData = resp.filter(
					(item) => item.userId === userId,
				);
				if (!filteredData || !filteredData.length) {
					return addUser();
				} else if (filteredData[0].userName !== userName) {
					return setErrorText(
						"Your name does't match with this username!",
					);
				} else {
					return closeModal();
				}
			} else {
				return addUser();
			}
		});
	};

	const logout = () => {
		window.localStorage.clear();
		setUserModal(true);
		setSelectedChat(null);
		setData(null);
		setChatRef(null);
		setMessages([]);
	};

	const selectChat = async (selectedItem) => {
		try {
			const querySnapshot = await getDocs(collection(db, 'messages'));
			const dataList = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			const filteredData = dataList.filter(
				(item) =>
					item.players.includes(selectedItem.userId) &&
					item.players.includes(user.userId),
			);
			if (!filteredData || !filteredData.length) {
				await addDoc(collection(db, 'messages'), {
					players: [selectedItem?.userId, user?.userId],
					messages: [],
					timestamp: Timestamp.now(),
				});
				if (chatRef) {
					setChatRef(null);
					setMessages([]);
				}
			} else {
				setChatRef(filteredData[0]);
				setMessages(filteredData[0].messages);
			}
			setSelectedChat(selectedItem);
		} catch (error) {
			console.error('Error fetching data: ', error);
		}
	};

	const updateMessages = (msg) => setMessages(msg);

	return (
		<div className={styles['main-wrapper']}>
			<Sidebar
				data={data?.filter((item) => item.userId !== user?.userId)}
				logout={logout}
				selectChat={selectChat}
				selectedChat={selectedChat}
			/>
			<ChatArea
				selectedChat={selectedChat}
				currentUser={user}
				chatRef={chatRef}
				messages={messages}
				updateMessages={updateMessages}
			/>
			<Modal isOpen={userModal} onClose={() => setUserModal(false)}>
				<div className={styles['modal-content-wrapper']}>
					{errorText ? (
						<div className={styles['modal-error-text']}>
							{errorText}
						</div>
					) : null}
					<div className={styles['modal-input-wrapper']}>
						<input
							onChange={(e) => handleInputChange(e, 'name')}
							ref={userNameRef}
							className={styles['modal-input-box']}
							type='text'
							placeholder='Enter your name'
						/>
					</div>
					<div className={styles['modal-input-wrapper']}>
						<input
							onChange={(e) => handleInputChange(e, 'id')}
							ref={userIdRef}
							className={styles['modal-input-box']}
							type='text'
							placeholder='Enter username'
						/>
					</div>
					<div className={styles['modal-input-wrapper']}>
						<Button onClick={startChat} block='true'>
							Start Chat
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default ChatModule;
