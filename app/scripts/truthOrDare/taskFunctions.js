import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

// Function to load a task from the Firebase Firestore database
export async function loadTaskFromDatabase(selectedCard, currentLang, setFetchedTask, setLoadedTask, setDatabaseErrorStatus, unavailableQuestions, setUnavailableQuestions) {
    if(selectedCard !== '') {
        try {
            const truthOrDareRef = collection(db, 'TruthOrDare');
            const questionsRef = doc(truthOrDareRef, 'Questions');
            const cardCollectionRef = collection(questionsRef, selectedCard);
            const questionsSnapshot = await getDocs(collection(questionsRef, selectedCard));

            let isUnavailable;
            let randomQuestionNumber;
            do {
              randomQuestionNumber = Math.floor(Math.random() * questionsSnapshot.size) + 1;
              isUnavailable = unavailableQuestions.some(
                question => question.number === randomQuestionNumber && question.type === selectedCard
              );
            } while (isUnavailable);

            if(unavailableQuestions.length >= 30) {
                unavailableQuestions.shift();
            }

            const cardDocRef = doc(cardCollectionRef, `${selectedCard}#${randomQuestionNumber}`);
            const cardDocSnapshot = await getDoc(cardDocRef);
            const cardData = cardDocSnapshot.data()[currentLang];
            setFetchedTask(cardData);
            setLoadedTask(true);
            setUnavailableQuestions([...unavailableQuestions, { number: randomQuestionNumber, type: selectedCard}]);
        } catch (error) {
            setDatabaseErrorStatus(true);
            setFetchedTask('');
        }
    }
}