import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

// Function to draw a category randomly from the available options
      function translateCategory(category) {
        switch (category) {
          case 'Dla par':
            return 'Couples';
          case 'Gry komputerowe':
            return 'PC Games';
          case 'Dla dorosłych':
            return 'For Adults';
          case 'Edukacja':
            return 'Education';
          case 'Życie miłosne':
            return 'Love Life';
          case 'Podróże':
            return 'Travels';
          default:
            return category;
        }
      }

  // Function to draw first category randomly from the available options
  export async function drawACategory(selectedCategories, setDrawnCategory, setTranslatedCategory) {
    const randomNumber = Math.floor(Math.random() * selectedCategories.length);
    const randCategory = selectedCategories[randomNumber].selectedCategoryName;

    setDrawnCategory(randCategory)
    setTranslatedCategory(translateCategory(randCategory));
  }


  // Function to draw second category randomly from the available options
  export async function drawSecondCategory(selectedCategories, setSecondDrawnCategory, setSecondTranslatedCategory) {
    const secondRandomNumber = Math.floor(Math.random() * selectedCategories.length);
    const secondRandCategory = selectedCategories[secondRandomNumber].selectedCategoryName;
  
    setSecondDrawnCategory(secondRandCategory)
    setSecondTranslatedCategory(translateCategory(secondRandCategory));
  }

  const neverHaveIEverRef = collection(db, 'NeverHaveIEver');

  // Fetching random question from database
  export async function getQuestion(translatedCategory, currentLang, setFirstQuestion, setDatabaseErrorStatus) {
    try {
      const categoryRef = doc(neverHaveIEverRef, translatedCategory);
      const questionsRef = collection(categoryRef, 'Questions');
      const questionsSnapshot = await getDocs(questionsRef);
      const randomQuestionNumber = Math.floor(Math.random() * questionsSnapshot.size) + 1;
      const questionDocRef = doc(categoryRef, 'Questions', `Question#${randomQuestionNumber}`);
      const questionDocSnapshot = await getDoc(questionDocRef);
      const questionText = questionDocSnapshot.data()[currentLang];
      setFirstQuestion(questionText);
    } catch (error) {
      setDatabaseErrorStatus(true);
      setFirstQuestion('');
    }
  }

  // Fetching second random question from database
  export async function getSecondQuestion(secondTranslatedCategory, currentLang, setSecondQuestion, setDatabaseErrorStatus) {
    try {
      const categoryRef = doc(neverHaveIEverRef, secondTranslatedCategory);
      const questionsRef = collection(categoryRef, 'Questions');
      const questionsSnapshot = await getDocs(questionsRef);
      const randomSecondQuestionNumber = Math.floor(Math.random() * questionsSnapshot.size) + 1;
      const secondQuestionDocRef = doc(categoryRef, 'Questions', `Question#${randomSecondQuestionNumber}`);
      const secondQuestionDocSnapshot = await getDoc(secondQuestionDocRef);
      const secondQuestionText = secondQuestionDocSnapshot.data()[currentLang];
      setSecondQuestion(secondQuestionText);
    } catch (error) {
      setDatabaseErrorStatus(true);
      setSecondQuestion('');
    }
  }
  