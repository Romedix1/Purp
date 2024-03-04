import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions, Text, StyleSheet, TouchableOpacity, Pressable, ScrollView, Animated, PanResponder } from 'react-native';
import { useFonts } from 'expo-font';
import { readLanguage } from './scripts/language'; // Import language functions
import { readCategories } from './scripts/categories'; // Import category from local storage
import Nav from './components/nav'; // Import Nav component
import LoadingScreen from './loadingScreen'; // Import loading screen component
import { drawACategory, drawSecondCategory, getQuestion, getSecondQuestion } from './scripts/neverHaveIEver/questionAndCategoryFunctions'; // Import questions and category functions

function NeverHaveIEver() {
  // Set variable with window width and window height using useWindowDimensions hook
  const { width: windowWidth,  height: windowHeight } = useWindowDimensions();

  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: '#131313',
      alignItems: 'center',
    },
    categoriesMenuBackgroundOpacity: {
      backgroundColor: '#000', 
      position: 'absolute', 
      opacity: .5, 
      zIndex: 5,
    },
    displayedCategory: {
      fontFamily: 'LuckiestGuy', 
      width: '90%',
      color: '#FFF', 
      textAlign: 'center',
      fontSize: .08 * windowWidth, 
      marginTop: .07 * windowWidth
    },
    questionContainer: {
      backgroundColor: '#41008B', 
      borderRadius: .09 * windowWidth,
      borderColor: '#FFF',
      width: .78 * windowWidth, 
      marginTop: .1 * windowWidth, 
      borderWidth: .009 * windowWidth, 
    },
    questionText: {
      textAlign: 'center', 
      fontFamily: 'LuckiestGuy', 
      color: '#FFF',
      fontSize: .08 * windowWidth,
      paddingVertical: .07 * windowWidth, 
      height: 1.05 * windowWidth, 
      paddingHorizontal: .05 * windowWidth
    },
    questionBackCard: {
      width: .78 * windowWidth, 
      borderRadius: 32, 
      borderColor: '#FFF', 
      paddingBottom: .2 * windowWidth, 
      borderWidth: 4,
      position: 'relative'
    },
    buttonContainer: {
      backgroundColor: '#6C1EC5',
      paddingVertical: .02 * windowWidth,
      borderRadius: .035 * windowWidth,
      width: '80%',
      textAlign: 'center',
      position: 'relative',
      top: -(.17 * windowWidth),
      marginBottom: .2 * windowWidth
    },
    buttonText: {
      textAlign: 'center',
      fontSize: .08 * windowWidth,
      fontFamily: 'LuckiestGuy',
      color: '#fff',
    },
  });

  // Set current language (default is english)
  const [currentLang, setCurrentLang] = useState('en');
  // Array of selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  // State for tracking categories menu status
  const [isCategoriesMenuOpened, setIsCategoriesMenuOpened] = useState(false);
  // State for storing the first question
  const [firstQuestion, setFirstQuestion] = useState('');
  // State for storing the second question
  const [secondQuestion, setSecondQuestion] = useState('');
  // State for storing the drawn category
  const [drawnCategory, setDrawnCategory] = useState('');
  // State for storing the second drawn category
  const [secondDrawnCategory, setSecondDrawnCategory] = useState('');
  // State for storing category translation (only in polish version)
  const [translatedCategory, setTranslatedCategory] = useState('');
  // State for storing second category translation (only in polish version)
  const [secondTranslatedCategory, setsecondTranslatedCategory] = useState('');
  // State for tracking categories on load (button handling)
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  // State for tracking which question should be displayed
  const [secondQuestionStatus, setSecondQuestionStatus] = useState(false);
  // State to check if the second question is loaded
  const [loadingSecondQuestion, setLoadingSecondQuestion] = useState(false);
  // State for tracking which direction the card should be discarded
  const [direction, setDirection] = useState(false);
  // State for tracking question on load (finger handling)
  const [questionFetched, setQuestionFetched] = useState(false);
  // State for tracking loading component
  const [componentLoaded, setComponentLoaded] = useState(false);
  // State for tracking loading questions
  const [questionsLoaded, setQuestionsLoaded] = useState(false);

  // State for rotation animation
  const rotateValue = useState(new Animated.Value(0))[0];
  // State for slide animation
  const slideValue = useState(new Animated.Value(0))[0];
  // State for height animation (categories menu)
  const categoriesHeight = useState(new Animated.Value(0))[0];

  // Interpolation for rotating the card based on the rotateValue
  const rotateCard = rotateValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });
  
  // Interpolation for translating the card along the X-axis based on the rotateValue
  const slideCard = rotateValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [ -(windowWidth * 1.5), 0, windowWidth * 1.5],
  });

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
      
      setTimeout(() => setComponentLoaded(true), 50)
    };

    fetchData();
  }, []);

  // Draw selected categories after load
  useEffect(() => {
    if (selectedCategories.length > 0) {
        drawACategory(selectedCategories, setDrawnCategory, setTranslatedCategory);
        drawSecondCategory(selectedCategories, setSecondDrawnCategory, setsecondTranslatedCategory);
    }
  }, [categoriesLoaded]);
  
  // Function to load second question which should be displayed
  useEffect(() => {
    if (translatedCategory) {
      if (!firstQuestion) {
        getQuestion(translatedCategory, currentLang, setFirstQuestion).then(() => {
          setTimeout(() => setQuestionsLoaded(true), 50)
          setTimeout(() => setComponentLoaded(true), 50)
        });
      }
      if (!secondQuestion) {
        getSecondQuestion(secondTranslatedCategory, currentLang, setSecondQuestion).then(() => {
          setTimeout(() => setQuestionsLoaded(true), 50)
          setTimeout(() => setComponentLoaded(true), 50)
        });
      }
    }
  }, [translatedCategory]);
  
  // Fetching question and category depend on question status
  useEffect(() => {
    async function fetchQuestionsAndDrawCategory() {
      if (secondQuestionStatus) {
        if (translatedCategory) {
          getQuestion(translatedCategory, currentLang, setFirstQuestion); 
          drawACategory(selectedCategories, setDrawnCategory, setTranslatedCategory);
        }
      } else {
        if (secondTranslatedCategory) {
          getSecondQuestion(secondTranslatedCategory, currentLang, setSecondQuestion);
          drawSecondCategory(selectedCategories, setSecondDrawnCategory, setsecondTranslatedCategory)
        }
      }
    }
    
    fetchQuestionsAndDrawCategory();
  }, [selectedCategories]);

  // Function for getting second question with card discard animation
  async function getQuestions() {
    setLoadingSecondQuestion(true);
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
      setSecondQuestionStatus(prev => !prev);
      // If the second question status is true, then get and draw the second question
      if (secondQuestionStatus) {
        getSecondQuestion(secondTranslatedCategory, currentLang, setSecondQuestion).then(() => {
          setLoadingSecondQuestion(false);
          drawSecondCategory(selectedCategories, setSecondDrawnCategory, setsecondTranslatedCategory);
        });
      // If the second question status is false, then get and draw the second question
      } else {
        getQuestion(translatedCategory, currentLang, setFirstQuestion).then(() => {
          setLoadingSecondQuestion(false);
          drawACategory(selectedCategories, setDrawnCategory, setTranslatedCategory);
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
  
      // Blocking swipe until the second question is loaded
      if (Math.abs(distance) > threshold) {
        if (!questionFetched && !loadingSecondQuestion) {
          setQuestionFetched(true);
          setTimeout(() => {
            getQuestions();
          }, 10);
        }
      }
    },
    onPanResponderRelease: () => {
      if (loadingSecondQuestion) {
        setQuestionFetched(false);
      }
    },
  });
  
  // Opening category container with animation
  const toggleCategories = () => {
    setIsCategoriesMenuOpened(!isCategoriesMenuOpened);

    Animated.timing(categoriesHeight, {
      toValue: isCategoriesMenuOpened ? 0 : .735 * windowWidth,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Display loading screen if component or fonts are not loaded
  if (!fontsLoaded || !componentLoaded || !questionsLoaded) {
    return <LoadingScreen/>;
  }

  return (
    <View>
      <Nav isCategoriesMenuOpened={isCategoriesMenuOpened} setIsCategoriesMenuOpened={setIsCategoriesMenuOpened} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} currentLang={currentLang} neverHaveIEver={true} toggleCategories={toggleCategories} categoriesHeight={categoriesHeight} />
  
      <ScrollView contentContainerStyle={styles.mainContainer}>
        {isCategoriesMenuOpened && <Pressable onPress={toggleCategories} style={[styles.categoriesMenuBackgroundOpacity, {width: 1 * windowWidth, height: 1 * windowHeight}]}></Pressable>}
        <Text style={styles.displayedCategory}>{currentLang === 'pl' ? 'Kategoria: ' : 'Category: '} {secondQuestionStatus ? secondDrawnCategory : drawnCategory} </Text>
  
        <View>
          <Animated.View {...panResponder.panHandlers} style={[styles.questionContainer, { transform: [{ rotate: !secondQuestionStatus ? rotateCard : '0deg' }, { translateX: !secondQuestionStatus ? slideCard : 0 }],  zIndex: secondQuestionStatus ? 1 : 2, position: 'relative' }]}>
            <Text style={styles.questionText}>{firstQuestion}</Text>
          </Animated.View>
          <Animated.View {...panResponder.panHandlers} style={[styles.questionContainer, { transform: [{ rotate: secondQuestionStatus ? rotateCard : '0deg' }, { translateX: secondQuestionStatus ? slideCard : 0 }], zIndex: secondQuestionStatus ? 2 : 1, position: 'absolute' }]}>
            <Text style={styles.questionText}>{secondQuestion}</Text>
          </Animated.View>
          <View style={[styles.questionBackCard, { top: -0.15 * windowWidth, zIndex: -2, backgroundColor: '#300066' }]}>
          </View>
          <View style={[styles.questionBackCard, { top: -0.3 * windowWidth, zIndex: -3, backgroundColor: '#1E0041' }]}>
          </View>
        </View>
  
        <TouchableOpacity disabled={loadingSecondQuestion} onPress={getQuestions} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>{currentLang === 'pl' ? 'Następne pytanie' : 'Next question '}</Text>
        </TouchableOpacity>
  
      </ScrollView>
    </View>
  );}

export default NeverHaveIEver;
