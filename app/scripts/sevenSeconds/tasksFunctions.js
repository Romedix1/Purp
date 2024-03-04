import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

// Fetching random question from database
export async function getFirstTask(setFirstTask, currentLang) {
    try {
        const sevenSecondsRef = collection(db, '7Seconds');
        const tasksSnapshot = await getDocs(sevenSecondsRef);
        const randomTaskIndex = Math.floor(Math.random() * tasksSnapshot.size) + 1;
        const randomTaskDoc = doc(sevenSecondsRef, `Task#${randomTaskIndex}`);
        const randomTaskDocSnapshot = await getDoc(randomTaskDoc);
        setFirstTask(randomTaskDocSnapshot.data()[currentLang]);
    } catch (error) {
        console.error('Error while fetching documents:', error);
        setFirstTask('');
    }
}

export async function getSecondTask(setSecondTask, currentLang) {
    try {
        const sevenSecondsRef = collection(db, '7Seconds');
        const tasksSnapshot = await getDocs(sevenSecondsRef);
        const randomTaskIndex = Math.floor(Math.random() * tasksSnapshot.size) + 1;
        const randomTaskDoc = doc(sevenSecondsRef, `Task#${randomTaskIndex}`);
        const randomTaskDocSnapshot = await getDoc(randomTaskDoc);
        setSecondTask(randomTaskDocSnapshot.data()[currentLang]);
    } catch (error) {
        console.error('Error while fetching documents:', error);
        setSecondTask('');
    }
}
    