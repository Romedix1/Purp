import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions, Text, StyleSheet, TouchableOpacity, Pressable, ScrollView, Animated,PanResponder } from 'react-native';
import { useFonts } from 'expo-font';
import { readLanguage } from './scripts/language';
import { readCategories } from './scripts/categories';
import Nav from './components/nav';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import LoadingScreen from './loadingScreen'; // Import loading screen component

function NeverHaveIEver() {
  // Set current lang default is english
  const [currentLang, setCurrentLang] = useState('en');
  // Array of selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  // State for tracking categories menu status
  const [isCategoriesOpen, setCategoriesOpen] = useState(false);
  // State for storing current question
  const [currentQuestion, setCurrentQuestion] = useState('');
  // State for storing next question
  const [nextQuestion, setNextQuestion] = useState('');
  // State for storing drawn category
  const [drawnCategory, setDrawnCategory] = useState('');
  // State for storing next drawn category
  const [nextDrawnCategory, setNextDrawnCategory] = useState('');
  // State for storing category translation but only in polish version
  const [translatedCategory, setTranslatedCategory] = useState('');
  // State for storing category translation but only in polish version
  const [nextTranslatedCategory, setNextTranslatedCategory] = useState('');
  // State for tracking categories on load (button handling)
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  // State for tracking which question should be displayed
  const [nextQuestionStatus, setNextQuestionStatus] = useState(false);
  // State to check if the next question is loaded
  const [loadingNextQuestion, setLoadingNextQuestion] = useState(false);
  // State for tracking which direction card should be discarded
  const [direction, setDirection] = useState(false);
  // State for tracking categories on load (finger handling)
  const [questionFetched, setQuestionFetched] = useState(false);
  // State for tracking loading component
  const [componentLoaded, setComponentLoaded] = useState(false);
  // State for tracking loading nav component
  const [navLoaded, setNavLoaded] = useState(false);
  // State for tracking loading nav component
  const [questionsLoaded, setQuestionsLoaded] = useState(false);


  // State for rotation animation
  const rotateValue = useState(new Animated.Value(0))[0];
  // State for slide animation
  const slideValue = useState(new Animated.Value(0))[0];
  // State for height animation (categories menu)
  const categoriesHeight = useState(new Animated.Value(0))[0];
  // Set variable with window width
  const { width: windowWidth } = useWindowDimensions();
  // Set variable with window height
  const { height: windowHeight } = useWindowDimensions();

  // Load fonts 
  const [fontsLoaded] = useFonts({
    LuckiestGuy: require('../assets/fonts/LuckiestGuy-Regular.ttf'),
  });

  // Fetching saved language
  useEffect(() => {
    const fetchData = async () => {
      const lang = await readLanguage();
      setCurrentLang(lang);

      // Fetching saved categories from local storage
      try {
        const category = await readCategories();
        setSelectedCategories(category);
        // Setting that categories are loaded
        setCategoriesLoaded(true);
      } catch (error) {
        console.error('Error while reading categories:', error);
      }
      
      // Set component and Nav component loaded state
      setTimeout(() => setComponentLoaded(true), 50)
      setTimeout(() => setNavLoaded(true), 50)
    };

    fetchData();
  }, []);

  // Draw selected categories after load
  useEffect(() => {
    if ( selectedCategories.length > 0) {
      drawACategory();
      drawNextCategory();
    }
  }, [categoriesLoaded]);
  
  // Function to load next question which should be displayed
  useEffect(() => {
    if (translatedCategory) {
      if (!currentQuestion) {
        getQuestion().then(() => {
          setTimeout(() => setQuestionsLoaded(true), 50)
          setTimeout(() => setComponentLoaded(true), 50)
          setTimeout(() => setNavLoaded(true), 50)
        });
      }
      if (!nextQuestion) {
        getNextQuestion().then(() => {
          setTimeout(() => setQuestionsLoaded(true), 50)
          setTimeout(() => setComponentLoaded(true), 50)
          setTimeout(() => setNavLoaded(true), 50)
        });
      }
    }
  }, [translatedCategory]);
  
  // Fetching question and category depend on question status
  useEffect(() => {
    async function fetchQuestionsAndDrawCategory() {
      if (nextQuestionStatus) {
        if (translatedCategory) {
          getQuestion();  
          drawACategory();
        }
      } else {
        if (nextTranslatedCategory) {
          getNextQuestion();
          drawNextCategory()
        }
      }
    }
    
    fetchQuestionsAndDrawCategory();
  }, [selectedCategories]);
  
  // Function to draw a category randomly from the available options
  async function drawACategory() {
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
  async function drawNextCategory() {
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
  async function getQuestion() {
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
      console.error('Error while fetching documents:', error);
      setCurrentQuestion('');
    }
  }

  // Fetching next random question from database
  async function getNextQuestion() {
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
      console.error('Error while fetching documents:', error);
      setNextQuestion('');
    }
  }
  
  // Function for getting next questions with card discard animation
  async function getQuestions() {
    setLoadingNextQuestion(true);
    Animated.parallel([
      Animated.timing(rotateValue, {
        toValue: direction ? 1 : -1,
        duration: 650,
        useNativeDriver: false,
      }),
      Animated.timing(slideValue, {
        toValue: 1,
        duration: direction ? 1 : -1,
        useNativeDriver: false,
      }),
    ]).start(() => {
      rotateValue.setValue(0);
      slideValue.setValue(0);
      
      // Changing state for the question which should be displayed
      setNextQuestionStatus(prev => !prev);
      // If the next question status is true, then get and draw the next question
      if (nextQuestionStatus) {
        getNextQuestion().then(() => {
          setLoadingNextQuestion(false);
          drawNextCategory();
        });
      // If the next question status is false, then get and draw the next question
      } else {
        getQuestion().then(() => {
          setLoadingNextQuestion(false);
          drawACategory();
        });
      }
    });
  }

  // Handling finger swipe functionality
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const distance = gestureState.dx;
      const threshold = 50;
  
      // Setting the direction in which the card should be discarded
      if (distance > 0) {
        setDirection(true);
      } else {
        setDirection(false);
      }
  
      // Blocking swipe until the next question is loaded
      if (Math.abs(distance) > threshold) {
        if (!questionFetched && !loadingNextQuestion) {
          setQuestionFetched(true);
          setTimeout(() => {
            getQuestions();
          }, 10);
        }
      }
    },
    onPanResponderRelease: () => {
      if (loadingNextQuestion) {
        setQuestionFetched(false);
      }
    },
  });
  
  
  // Opening category container with animation
  const toggleCategories = () => {
    setCategoriesOpen(!isCategoriesOpen);

    Animated.timing(categoriesHeight, {
      toValue: isCategoriesOpen ? 0 : .76 * windowWidth,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const rotateCard = rotateValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  const slideCard = rotateValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [ -(windowWidth * 1.5), 0, windowWidth * 1.5],
  });

  // Display loading screen if component or fonts are not loaded
  if (!fontsLoaded || !componentLoaded || !questionsLoaded) {
    return <LoadingScreen/>;
  }

  return (
    <View>
      <Nav isCategoriesOpen={isCategoriesOpen} setCategoriesOpen={setCategoriesOpen} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} currentLang={currentLang} neverHaveIEver={true} toggleCategories={toggleCategories} categoriesHeight={categoriesHeight} />
  
      <ScrollView contentContainerStyle={styles.neverHaveIEverContainer}>
        {isCategoriesOpen && <Pressable onPress={toggleCategories} style={[styles.categoriesMenuBackgroundShadow, { width: 1 * windowWidth, height: 1 * windowHeight}]}></Pressable>}
        <Text style={[styles.displayedCategory, { fontSize: 0.08 * windowWidth, marginTop: 0.07 * windowWidth}]}>Kategoria: {nextQuestionStatus ? nextDrawnCategory : drawnCategory} </Text>
  
        <View>
          <Animated.View {...panResponder.panHandlers} style={[styles.questionContainer, { transform: [{ rotate: !nextQuestionStatus ? rotateCard : '0deg' }, { translateX: !nextQuestionStatus ? slideCard : 0 }], width: 0.78 * windowWidth, zIndex: nextQuestionStatus ? 1 : 2, position: 'relative',  marginTop: 0.1 * windowWidth, borderWidth: 4 }]}>
            <Text style={[styles.questionText, { fontSize: 0.08 * windowWidth, paddingVertical: 0.07 * windowWidth, minHeight: 1.05 * windowWidth, paddingHorizontal: 0.05 * windowWidth }]}>{currentQuestion}</Text>
          </Animated.View>
          <Animated.View {...panResponder.panHandlers} style={[styles.questionContainer, { transform: [{ rotate: nextQuestionStatus ? rotateCard : '0deg' }, { translateX: nextQuestionStatus ? slideCard : 0 }],width: 0.78 * windowWidth, position: 'absolute',  zIndex: nextQuestionStatus ? 2 : 1, marginTop: 0.1 * windowWidth, borderWidth: 4 }]}>
            <Text style={[styles.questionText, { fontSize: 0.08 * windowWidth, paddingVertical: 0.07 * windowWidth, minHeight: 1.05 * windowWidth, paddingHorizontal: 0.05 * windowWidth }]}>{nextQuestion}</Text>
          </Animated.View>
          <View style={{ width: 0.78 * windowWidth, position: 'relative', top: -0.15 * windowWidth, zIndex: -2, backgroundColor: '#300066', borderRadius: 32, borderColor: '#FFF', paddingBottom: 0.2 * windowWidth, borderWidth: 4 }}>
          </View>
          <View style={{ width: 0.78 * windowWidth, position: 'relative', top: -0.3 * windowWidth, zIndex: -3, backgroundColor: '#1E0041', borderRadius: 32, borderColor: '#FFF', paddingBottom: 0.2 * windowWidth, borderWidth: 4 }}>
          </View>
        </View>
  
        <TouchableOpacity disabled={loadingNextQuestion} onPress={getQuestions} style={[styles.neverHaveIEverButtonContainer, { marginBottom: 0.2 * windowWidth }]}>
          <Text style={styles.neverHaveIEverButtonText}>Następne pytanie</Text>
        </TouchableOpacity>
  
      </ScrollView>
    </View>
  );}
const styles = StyleSheet.create({
  neverHaveIEverContainer: {
    backgroundColor: '#131313',
    alignItems: 'center',
  },
  neverHaveIEverButtonContainer: {
    backgroundColor: '#6C1EC5',
    width: '80%',
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 16,
    textAlign: 'center',
    position: 'relative',
    top: -50,
  },
  categoriesMenuBackgroundShadow: {
    backgroundColor: '#000', 
    position: 'absolute', 
    opacity: 0.5, 
    zIndex: 5 
  },
  questionContainer: {
    backgroundColor: '#41008B', 
    borderRadius: 32, 
    borderColor: '#FFF',
  },
  questionText: {
    textAlign: 'center', 
    fontFamily: 'LuckiestGuy', 
    color: '#FFF',
  },
  displayedCategory: {
    fontFamily: 'LuckiestGuy', 
    width: '90%',
    color: '#FFF', 
    textAlign: 'center' 
  },
  neverHaveIEverButtonText: {
    textAlign: 'center',
    fontSize: 32,
    fontFamily: 'LuckiestGuy',
    color: '#fff',
  },
});

export default NeverHaveIEver;
