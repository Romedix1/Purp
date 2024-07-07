import React, { useState, useEffect,useRef } from 'react';
import { View, useWindowDimensions, Text, StyleSheet, TouchableOpacity, Pressable, ScrollView, Animated, PanResponder, Button } from 'react-native';
import { useFonts } from 'expo-font';
import { readLanguage } from './scripts/language'; // Import language functions
import { readCategories } from './scripts/categories'; // Import category from local storage
import Nav from './components/nav'; // Import Nav component
import LoadingScreen from './loadingScreen'; // Import loading screen
import DatabaseErrorScreen from './databaseError'; // Import database error screen
import { getQuestion, getSecondQuestion } from './scripts/neverHaveIEver/questionAndCategoryFunctions'; // Import questions and category functions
import useNetInfo from './scripts/checkConnection'
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { readAdCounter, saveAdCounter } from './scripts/adCounter'
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';

const adUnitId = TestIds.INTERSTITIAL;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

function NeverHaveIEver() {
  // Set variable with window width and window height using useWindowDimensions hook
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

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
  const [secondTranslatedCategory, setSecondTranslatedCategory] = useState('');
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
  // State for tracking database errors
  const [databaseErrorStatus, setDatabaseErrorStatus] = useState(false);
  // State to manage the state of the nav menu (open/close)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State to tracking when ad should be displayed
  const [adCounter, setAdCounter] = useState(1);
  const [counterLoaded, setCounterLoaded] = useState(false);
  // State to tracking that ad is loaded
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  // Array with recently used questions
  const [unavailableQuestions, setUnavailableQuestions] = useState([]);

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
      width: 1 * windowWidth, 
      height: 6 * windowHeight
    },
    displayedCategory: {
      fontFamily: 'LuckiestGuy', 
      width: '90%',
      color: '#FFF', 
      textAlign: 'center',
      fontSize: isTablet ? .055 * windowWidth : .08 * windowWidth, 
      marginTop: isTablet ? .045 * windowWidth : .07 * windowWidth
    },
    questionContainer: {
      backgroundColor: '#41008B', 
      borderRadius: .09 * windowWidth,
      borderColor: '#FFF',
      width: isTablet ? .65 * windowWidth : .78 * windowWidth, 
      marginTop: isTablet ? .06 * windowWidth : .1 * windowWidth, 
      borderWidth: .009 * windowWidth,
      minHeight: isTablet ? .60 * windowWidth : 1.05 * windowWidth,
      paddingTop: isTablet ? .1 * windowWidth : .15 * windowWidth, 
      paddingHorizontal: .05 * windowWidth
    },
    questionText: {
      textAlign: 'center', 
      fontFamily: 'LuckiestGuy', 
      color: '#FFF',
      fontSize: isTablet ? .05 * windowWidth : .08 * windowWidth,
      minHeight:  isTablet ? .55 * windowWidth : 1 * windowWidth
    },
    questionBackCard: {
      width: isTablet ? .65 * windowWidth : .78 * windowWidth, 
      borderRadius: isTablet ? 56 : 32, 
      borderColor: '#FFF', 
      paddingBottom: .2 * windowWidth, 
      borderWidth: 4,
      position: 'relative'
    },
    buttonContainer: {
      backgroundColor: '#6C1EC5',
      paddingVertical: .02 * windowWidth,
      borderRadius: .035 * windowWidth,
      width: isTablet ? '65%' : '80%',
      textAlign: 'center',
      position: 'relative',
      top: isTablet ? -(.25 * windowWidth) : -(.17 * windowWidth),
      marginBottom: isTablet ? .04 * windowWidth : .2 * windowWidth
    },
    buttonText: {
      textAlign: 'center',
      fontSize: isTablet ? .05 * windowWidth : .08 * windowWidth,
      fontFamily: 'LuckiestGuy',
      color: '#fff',
    },
  });

  // State for rotation animation
  const rotateValue = useState(new Animated.Value(0))[0];
  // State for slide animation
  const slideValue = useState(new Animated.Value(0))[0];
  // State for height animation (categories menu)
  const categoriesHeight = useState(new Animated.Value(0))[0];
  // Ref for arrow rotation animation
  const arrowRotate = useRef(new Animated.Value(0)).current;

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
    
  // Interpolate arrow rotation value for animation
  const arrowRotateInterpolate = arrowRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['90deg', '270deg'],
  });

  // Load fonts 
  const [fontsLoaded] = useFonts({
    LuckiestGuy: require('../assets/fonts/LuckiestGuy-Regular.ttf'),
  });

  const netInfo = useNetInfo();

  // Fetching saved language, categories and ad counter value
  useEffect(() => {
    let componentTimeout;

    const fetchData = async () => {
      const lang = await readLanguage();
      setCurrentLang(lang);

      const counter = await readAdCounter();
      setAdCounter(counter);
      setCounterLoaded(true);

      // Fetching saved categories from local storage
      const category = await readCategories();
      setSelectedCategories(category);
      // Setting that categories are loaded
      setCategoriesLoaded(true);

      setIsTablet(windowWidth>=600)

      componentTimeout = setTimeout(() => setComponentLoaded(true), 50)
    };

    fetchData();

    return () => {
      clearTimeout(componentTimeout)
    }
  }, []);

  useEffect(() => {
    if(counterLoaded)
    {
      saveAdCounter(adCounter);
    }
  }, [adCounter]);

  // Clear cache
  async function clearCache() {
      await FileSystem.deleteAsync(FileSystem.cacheDirectory, { idempotent: true });
  }
  
  useEffect(() => {
    const handleAdLoaded = () => {
      setIsAdLoaded(true);
    };
  
    const handleAdClosed = () => {
      setIsAdLoaded(false);
      setAdCounter(1)
      clearCache();
    };
  
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, handleAdLoaded);
    const unsubscribeAdClosed = interstitial.addAdEventListener(AdEventType.CLOSED, handleAdClosed);

    interstitial.load();
  
    return () => {
      unsubscribeLoaded();
      unsubscribeAdClosed();

      interstitial.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if(!isAdLoaded)
    {
      interstitial.load();
      setIsAdLoaded(true);
    }

      if (adCounter % 10 === 0) {
        interstitial.show();
      }
  }, [adCounter]);


  
  // Function to load second question which should be displayed
  useEffect(() => {
    let firstQuestionTimeout;
    let secondQuestionTimeout;

    if(categoriesLoaded) {
        if (!firstQuestion) {
          getQuestion(currentLang, setFirstQuestion, setDatabaseErrorStatus, setDrawnCategory, setTranslatedCategory, selectedCategories, unavailableQuestions, setUnavailableQuestions).then(() => {
            firstQuestionTimeout = setTimeout(() => {
              setQuestionsLoaded(true);
              setComponentLoaded(true);
            }, 50);
          })
        }
    
        if (!secondQuestion) {
          getSecondQuestion(currentLang, setSecondQuestion, setDatabaseErrorStatus, setSecondDrawnCategory, setSecondTranslatedCategory, selectedCategories, unavailableQuestions, setUnavailableQuestions).then(() => {
              secondQuestionTimeout = setTimeout(() => {
                setQuestionsLoaded(true);
                setComponentLoaded(true);
              }, 50);
          });
      }
    }
    return () => {
      clearTimeout(firstQuestionTimeout);
      clearTimeout(secondQuestionTimeout);
    };
  }, [categoriesLoaded]);
  
  // Fetching question and category depend on question status
  useEffect(() => {
    async function fetchQuestionsAndDrawCategory() {
      if(categoriesLoaded) {
        if (secondQuestionStatus) {
          if (translatedCategory) {
            getQuestion(currentLang, setFirstQuestion, setDatabaseErrorStatus, setDrawnCategory, setTranslatedCategory, selectedCategories, unavailableQuestions, setUnavailableQuestions)
          }
        } else {
          if (secondTranslatedCategory) {
            getSecondQuestion(currentLang, setSecondQuestion, setDatabaseErrorStatus, setSecondDrawnCategory, setSecondTranslatedCategory, selectedCategories, unavailableQuestions, setUnavailableQuestions)
          }
        }
      }
    }
    
    fetchQuestionsAndDrawCategory();
  }, [selectedCategories]);

  // Opening category container with animation
  const rotateArrow = () => {
    setIsMenuOpen(!isMenuOpen);
    Animated.timing(arrowRotate, {
      toValue: isMenuOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

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
      if(secondQuestionStatus) {
        getSecondQuestion(currentLang, setSecondQuestion, setDatabaseErrorStatus, setSecondDrawnCategory, setSecondTranslatedCategory, selectedCategories, unavailableQuestions, setUnavailableQuestions).then(() => {
            setLoadingSecondQuestion(false);
          });
      // If the second question status is false, then get and draw the second question
      } else {
        getQuestion(currentLang, setFirstQuestion, setDatabaseErrorStatus, setDrawnCategory, setTranslatedCategory, selectedCategories, unavailableQuestions, setUnavailableQuestions).then(() => {
            setLoadingSecondQuestion(false);
        });
      }

      if(counterLoaded) {
        setAdCounter((prev) => prev+1)
      }
    });
  }

  let swipeTimeout;

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
          swipeTimeout = setTimeout(() => {
            getQuestions();
          }, 10);
        }
      }
    },
    onPanResponderRelease: () => {
      clearTimeout(swipeTimeout);
      if (loadingSecondQuestion) {
        setQuestionFetched(false);
      }
    },

    onPanResponderTerminate: () => {
      clearTimeout(swipeTimeout);
      if (loadingSecondQuestion) {
        setQuestionFetched(false);
      }
    },
  });
  
  // Opening category container with animation
  const toggleCategories = () => {
    setIsCategoriesMenuOpened(!isCategoriesMenuOpened);

    Animated.timing(categoriesHeight, {
      toValue: isCategoriesMenuOpened ? 0 : (isTablet ? .555 * windowWidth : .735 * windowWidth),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Display loading screen if component or fonts are not loaded
  if (!fontsLoaded || !componentLoaded || !questionsLoaded) {
    return <LoadingScreen/>;
  }

  // Display database error screen if there is error in fetching from database
  if (databaseErrorStatus) {
    return <DatabaseErrorScreen/>;
  }

  // Display internet connection error screen if there is no internet connection
  if (!netInfo) {
    return <ConnectionErrorScreen/>;
  }

  return (
    <View style={{backgroundColor: '#131313'}}>
      <StatusBar backgroundColor='#000' style="light" />
      <Nav isTablet={isTablet} isCategoriesMenuOpened={isCategoriesMenuOpened} setIsCategoriesMenuOpened={setIsCategoriesMenuOpened} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} currentLang={currentLang} neverHaveIEver={true} toggleCategories={toggleCategories} categoriesHeight={categoriesHeight} rotateArrow={rotateArrow} arrowRotateInterpolate={arrowRotateInterpolate} />
      <ScrollView contentContainerStyle={styles.mainContainer}>
        {isCategoriesMenuOpened && <Pressable onPress={() => {toggleCategories(), rotateArrow()}} style={styles.categoriesMenuBackgroundOpacity}></Pressable>}
        <Text style={styles.displayedCategory}>{currentLang === 'pl' ? 'Kategoria: ' : 'Category: '} {secondQuestionStatus ? secondDrawnCategory : drawnCategory} </Text>
  
        <View>
          <Animated.View {...panResponder.panHandlers} style={[styles.questionContainer, { transform: [{ rotate: !secondQuestionStatus ? rotateCard : '0deg' }, { translateX: !secondQuestionStatus ? slideCard : 0 }],  zIndex: secondQuestionStatus ? 1 : 2, position: 'relative' }]}>
            <Text style={styles.questionText}>{firstQuestion}</Text>
          </Animated.View>
          <Animated.View {...panResponder.panHandlers} style={[styles.questionContainer, { transform: [{ rotate: secondQuestionStatus ? rotateCard : '0deg' }, { translateX: secondQuestionStatus ? slideCard : 0 }], zIndex: secondQuestionStatus ? 2 : 1, position: 'absolute' }]}>
            <Text style={styles.questionText}>{secondQuestion}</Text>
          </Animated.View>
          <View style={[styles.questionBackCard, { top: isTablet ? -0.17 * windowWidth : -0.15 * windowWidth, zIndex: -2, backgroundColor: '#300066' }]}>
          </View>
          <View style={[styles.questionBackCard, { top: isTablet ? -0.33 * windowWidth : -0.3 * windowWidth, zIndex: -3, backgroundColor: '#1E0041' }]}>
          </View>
        </View>
  
        <TouchableOpacity disabled={loadingSecondQuestion} onPress={getQuestions} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>{currentLang === 'pl' ? 'Następne pytanie' : 'Next question '}</Text>
        </TouchableOpacity>
  
      </ScrollView>
    </View>
  );}

export default NeverHaveIEver;
