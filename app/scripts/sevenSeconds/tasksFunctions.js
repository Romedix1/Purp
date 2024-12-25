import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

// Helper function to get a random task
async function getRandomTask(setTask, currentLang, setDatabaseErrorStatus, unavailableQuestions, setUnavailableQuestions) {
    try {
        const sevenSecondsRef = collection(db, '7Seconds');
        const tasksSnapshot = await getDocs(sevenSecondsRef);

        let isUnavailable;
        let randomTaskIndex;

        do {
          randomTaskIndex = Math.floor(Math.random() * tasksSnapshot.size) + 1;
          isUnavailable = unavailableQuestions.some(
            question => question.number === randomTaskIndex && question.category === translateCategory(randCategory)
          );
        } while (isUnavailable);
  
        if(unavailableQuestions.length >= 30) {
          unavailableQuestions.shift();
        }

        const taskDocs = tasksSnapshot.docs;
        const randomTaskDoc = taskDocs[randomTaskIndex];
        const randomTaskDocSnapshot = await getDoc(randomTaskDoc.ref);

        const taskData = randomTaskDocSnapshot.data();

        setTask(taskData[currentLang]);
        setUnavailableQuestions([...unavailableQuestions, randomTaskIndex]);
    } catch (error) {
        setDatabaseErrorStatus(true);
        setTask('');
    }
}

// Fetching random question from database
export async function getFirstTask(setFirstTask, currentLang, setDatabaseErrorStatus, unavailableQuestions, setUnavailableQuestions) {
    await getRandomTask(setFirstTask, currentLang, setDatabaseErrorStatus, unavailableQuestions, setUnavailableQuestions);
}

export async function getSecondTask(setSecondTask, currentLang, setDatabaseErrorStatus, unavailableQuestions, setUnavailableQuestions) {
    await getRandomTask(setSecondTask, currentLang, setDatabaseErrorStatus, unavailableQuestions, setUnavailableQuestions);
}
