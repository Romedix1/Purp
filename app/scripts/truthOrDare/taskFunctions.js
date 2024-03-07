import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

// Function to load a task from the Firebase Firestore database
export async function loadTaskFromDatabase(selectedCard, currentLang, setFetchedTask, setLoadedTask, setDatabaseErrorStatus) {
    if(selectedCard !== '') {
        try {
            const truthOrDareRef = collection(db, 'TruthOrDare');
            const questionsRef = doc(truthOrDareRef, 'Questions');
            const cardCollectionRef = collection(questionsRef, selectedCard);
            const questionsSnapshot = await getDocs(collection(questionsRef, selectedCard));
            const randomQuestionNumber = Math.floor(Math.random() * questionsSnapshot.size) + 1;
            const cardDocRef = doc(cardCollectionRef, `${selectedCard}#${randomQuestionNumber}`);
            const cardDocSnapshot = await getDoc(cardDocRef);
            const cardData = cardDocSnapshot.data()[currentLang];
            setFetchedTask(cardData);
            setLoadedTask(true);
        } catch (error) {
            setDatabaseErrorStatus(true);
            setFetchedTask('');
        }
    }
}