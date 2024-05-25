import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyDo5ATxE7RdhG0JhD-p7AIBSGCUkyQ9VKA',
	authDomain: 'cognite-test-chat-app.firebaseapp.com',
	projectId: 'cognite-test-chat-app',
	storageBucket: 'cognite-test-chat-app.appspot.com',
	messagingSenderId: '474143968545',
	appId: '1:474143968545:web:3226e5999dceb7da3f8260',
	measurementId: 'G-2HQ4Z9BZH6',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
