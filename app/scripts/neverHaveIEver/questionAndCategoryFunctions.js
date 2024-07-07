import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
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
          case 'Ogólne':
            return 'General';
          case 'Podróże':
            return 'Travels';
          default:
            return category;
        }
      }

  const neverHaveIEverRef = collection(db, 'NeverHaveIEver');

  // Fetching random question from database
  export async function getQuestion(currentLang, setFirstQuestion, setDatabaseErrorStatus, setDrawnCategory, setTranslatedCategory, selectedCategories, unavailableQuestions, setUnavailableQuestions) {
    const randomNumber = Math.floor(Math.random() * selectedCategories.length);
    const randCategory = selectedCategories[randomNumber].selectedCategoryName;

    setDrawnCategory(randCategory)
    setTranslatedCategory(translateCategory(randCategory))

    try {
      const categoryRef = doc(neverHaveIEverRef, translateCategory(randCategory));
      const questionsRef = collection(categoryRef, 'Questions');
      const questionsSnapshot = await getDocs(questionsRef);
      
      let isUnavailable;
      let randomQuestionNumber;
      do {
        randomQuestionNumber = Math.floor(Math.random() * questionsSnapshot.size) + 1;
        isUnavailable = unavailableQuestions.some(
          question => question.number === randomQuestionNumber && question.category === translateCategory(randCategory)
        );
      } while (isUnavailable);

      if(unavailableQuestions.length >= 30) {
        unavailableQuestions.shift();
      }

      const questionDocRef = doc(categoryRef, 'Questions', `Question#${randomQuestionNumber}`);
      const questionDocSnapshot = await getDoc(questionDocRef);
      const questionText = questionDocSnapshot.data()[currentLang];
      setFirstQuestion(questionText);
      setUnavailableQuestions([...unavailableQuestions, { number: randomQuestionNumber, category: translateCategory(randCategory)}]);
      console.log(unavailableQuestions);
    } catch (error) {
      console.log(error);
      setDatabaseErrorStatus(true);
      setFirstQuestion(error);
    }
  }

  // Fetching second random question from database
  export async function getSecondQuestion(currentLang, setSecondQuestion, setDatabaseErrorStatus, setSecondDrawnCategory, setSecondTranslatedCategory, selectedCategories, unavailableQuestions, setUnavailableQuestions) {
    const secondRandomNumber = Math.floor(Math.random() * selectedCategories.length);
    const secondRandCategory = selectedCategories[secondRandomNumber].selectedCategoryName;
  
    setSecondDrawnCategory(secondRandCategory)
    setSecondTranslatedCategory(translateCategory(secondRandCategory))
    console.log(translateCategory(secondRandCategory))
    try {
      const categoryRef = doc(neverHaveIEverRef, translateCategory(secondRandCategory));
      const questionsRef = collection(categoryRef, 'Questions');
      const questionsSnapshot = await getDocs(questionsRef);

      let isUnavailable;
      let randomSecondQuestionNumber;
      do {
        randomSecondQuestionNumber = Math.floor(Math.random() * questionsSnapshot.size) + 1;
        isUnavailable = unavailableQuestions.some(
          question => question.number === randomSecondQuestionNumber && question.category === translateCategory(secondRandCategory)
        );
      } while (isUnavailable);

      if(unavailableQuestions.length >= 30) {
        unavailableQuestions.shift();
      }

      const secondQuestionDocRef = doc(categoryRef, 'Questions', `Question#${randomSecondQuestionNumber}`);
      const secondQuestionDocSnapshot = await getDoc(secondQuestionDocRef);
      const secondQuestionText = secondQuestionDocSnapshot.data()[currentLang];
      setSecondQuestion(secondQuestionText);
      setUnavailableQuestions([...unavailableQuestions, { number: randomSecondQuestionNumber, category: translateCategory(secondRandCategory)}]);
      console.log(unavailableQuestions);
    } catch (error) {
      console.log(error);
      setDatabaseErrorStatus(true);
      setSecondQuestion(error);
    }
  }
  