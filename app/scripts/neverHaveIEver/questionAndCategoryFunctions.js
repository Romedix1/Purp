import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

// Function to draw a category randomly from the available options
    export async function drawACategory(selectedCategories, setDrawnCategory, setTranslatedCategory) {
        const randomNumber = Math.floor(Math.random() * selectedCategories.length);
        const randCategory = selectedCategories[randomNumber].selectedCategoryName;

        setDrawnCategory(randCategory);

        // Category translations (polish version)
        switch (randCategory) {
        case 'Dla par':
            setTranslatedCategory('Couples');
            break;
        case 'Gry komputerowe':
            setTranslatedCategory('PC Games');
            break;
        case 'Dla dorosłych':
            setTranslatedCategory('For Adults');
            break;
        case 'Edukacja':
            setTranslatedCategory('Education');
            break;
        case 'Życie miłosne':
            setTranslatedCategory('Love Life');
            break;
        case 'Podróże':
            setTranslatedCategory('Travels');
            break;
        }
    }


  // Function to draw next category randomly from the available options
  export async function drawSecondCategory(selectedCategories, setNextDrawnCategory, setNextTranslatedCategory) {
    const nextRandomNumber = Math.floor(Math.random() * selectedCategories.length);
    const nextRandCategory = selectedCategories[nextRandomNumber].selectedCategoryName;
  
    setNextDrawnCategory(nextRandCategory)

    // Category translations (polish version)
    switch (nextRandCategory) {
      case 'Dla par':
        setNextTranslatedCategory('Couples');
        break;
      case 'Gry komputerowe':
        setNextTranslatedCategory('PC Games');
        break;
      case 'Dla dorosłych':
        setNextTranslatedCategory('For Adults');
        break;
      case 'Edukacja':
        setNextTranslatedCategory('Education');
        break;
      case 'Życie miłosne':
        setNextTranslatedCategory('Love Life');
        break;
      case 'Podróże':
        setNextTranslatedCategory('Travels');
        break;
    }
  }

  // Fetching random question from database
  export async function getQuestion(translatedCategory, currentLang, setCurrentQuestion, setDatabaseErrorStatus) {
    try {
      const neverHaveIEverRef = collection(db, 'NeverHaveIEver');
      const categoryRef = doc(neverHaveIEverRef, translatedCategory);
      const questionsSnapshot = await getDocs(collection(categoryRef, 'Questions'));
      const randomQuestionNumber = Math.floor(Math.random() * questionsSnapshot.size) + 1;
      const questionDocRef = doc(categoryRef, 'Questions', `Question#${randomQuestionNumber}`);
      const questionDocSnapshot = await getDoc(questionDocRef);
      const questionText = questionDocSnapshot.data()[currentLang];
      setCurrentQuestion(questionText);
    } catch (error) {
      setDatabaseErrorStatus(true);
      setCurrentQuestion('');
    }
  }

  // Fetching next random question from database
  export async function getSecondQuestion(nextTranslatedCategory, currentLang, setNextQuestion, setDatabaseErrorStatus) {
    try {
      const neverHaveIEverRef = collection(db, 'NeverHaveIEver');
      const categoryRef = doc(neverHaveIEverRef, nextTranslatedCategory);
      const questionsSnapshot = await getDocs(collection(categoryRef, 'Questions'));
      const randomNextQuestionNumber = Math.floor(Math.random() * questionsSnapshot.size) + 1;
      const nextQuestionDocRef = doc(categoryRef, 'Questions', `Question#${randomNextQuestionNumber}`);
      const nextQuestionDocSnapshot = await getDoc(nextQuestionDocRef);
      const nextQuestionText = nextQuestionDocSnapshot.data()[currentLang];
      setNextQuestion(nextQuestionText);
    } catch (error) {
      setDatabaseErrorStatus(true);
      setNextQuestion('');
    }
  }
  