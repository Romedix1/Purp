import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

// Function to draw a category randomly from the available options
    export async function drawACategory(selectedCategories, setDrawnCategory, setTranslatedCategory) {
        const randomNumber = Math.floor(Math.random() * selectedCategories.length);
        const randCategory = selectedCategories[randomNumber].selectedCategoryName;

        setDrawnCategory(randCategory)

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
        default: 
            setTranslatedCategory(randCategory);
        }
    }


  // Function to draw second category randomly from the available options
  export async function drawSecondCategory(selectedCategories, setSecondDrawnCategory, setSecondTranslatedCategory) {
    const secondRandomNumber = Math.floor(Math.random() * selectedCategories.length);
    const secondRandCategory = selectedCategories[secondRandomNumber].selectedCategoryName;
  
    setSecondDrawnCategory(secondRandCategory)

    // Category translations (polish version)
    switch (secondRandCategory) {
      case 'Dla par':
        setSecondTranslatedCategory('Couples');
        break;
      case 'Gry komputerowe':
        setSecondTranslatedCategory('PC Games');
        break;
      case 'Dla dorosłych':
        setSecondTranslatedCategory('For Adults');
        break;
      case 'Edukacja':
        setSecondTranslatedCategory('Education');
        break;
      case 'Życie miłosne':
        setSecondTranslatedCategory('Love Life');
        break;
      case 'Podróże':
        setSecondTranslatedCategory('Travels');
        break;
      default: 
        setSecondTranslatedCategory(secondRandCategory);
    }
  }

  // Fetching random question from database
  export async function getQuestion(translatedCategory, currentLang, setFirstQuestion, setDatabaseErrorStatus) {
    try {
      const neverHaveIEverRef = collection(db, 'NeverHaveIEver');
      const categoryRef = doc(neverHaveIEverRef, translatedCategory);
      const questionsSnapshot = await getDocs(collection(categoryRef, 'Questions'));
      const randomQuestionNumber = Math.floor(Math.random() * questionsSnapshot.size) + 1;
      const questionDocRef = doc(categoryRef, 'Questions', `Question#${randomQuestionNumber}`);
      const questionDocSnapshot = await getDoc(questionDocRef);
      const questionText = questionDocSnapshot.data()[currentLang];
      setFirstQuestion(questionText || "sad");
    } catch (error) {
      setDatabaseErrorStatus(true);
      setFirstQuestion('');
    }
  }

  // Fetching second random question from database
  export async function getSecondQuestion(secondTranslatedCategory, currentLang, setSecondQuestion, setDatabaseErrorStatus) {
    try {
      const neverHaveIEverRef = collection(db, 'NeverHaveIEver');
      const categoryRef = doc(neverHaveIEverRef, secondTranslatedCategory);
      const questionsSnapshot = await getDocs(collection(categoryRef, 'Questions'));
      const randomSecondQuestionNumber = Math.floor(Math.random() * questionsSnapshot.size) + 1;
      const secondQuestionDocRef = doc(categoryRef, 'Questions', `Question#${randomSecondQuestionNumber}`);
      const secondQuestionDocSnapshot = await getDoc(secondQuestionDocRef);
      const secondQuestionText = secondQuestionDocSnapshot.data()[currentLang];
      setSecondQuestion(secondQuestionText || "asd");
    } catch (error) {
      setDatabaseErrorStatus(true);
      setSecondQuestion('');
    }
  }
  