import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Pressable, ScrollView, useWindowDimensions, PanResponder } from 'react-native';
import Nav from './components/nav'; // Import Nav component
import { useFonts } from "expo-font";
import Cards from './components/mainCards'; // Import game cards component
import { readLanguage, saveLanguage } from './scripts/language'; // Import language functions
import { readTerms } from './scripts/terms'; // Import language functions
import CardsData from './components/mainCardsData.json'; // Import game cards data component
import LoadingScreen from './loadingScreen'; // Import loading screen component
import TermsScreen from './termsScreen'; // Import terms screen component
import ConnectionErrorScreen from './connectionError'; // Import connection error screen component
import useNetInfo from './scripts/checkConnection'
import { StatusBar } from 'expo-status-bar';

const index = () => {
  // Load fonts 
  const [fontsLoaded] = useFonts({
    'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
  });

  // Set variable with window width using useWindowDimensions hook
  const { width: windowWidth } = useWindowDimensions();

  // Set current language (default is english)
  const [currentLang, setCurrentLang] = useState("en");
  // Set current card defualt card index is equel to 0 
  const [currentCard, setCurrentCard] = useState(0);
  // State for tracking whether the card is flipped default isn't flipped
  const [flipped, setFlipped] = useState(false);
  // Resetting flipped card status
  const [resetFlipped, setResetFlipped] = useState(false);
  // State for tracking loading component
  const [componentLoaded, setComponentLoaded] = useState(false);
  // State for tracking the acceptance status of the terms and conditions
  const [terms, setTerms] = useState(false);
  
  // Styles
  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: '#131313',
      width: '100%',
      alignItems: 'center',
      minHeight: 2.6 * windowWidth,
    },
    logoImage: {
      resizeMode: 'contain',
      height: 0.32 * windowWidth, 
      marginTop: .055 * windowWidth
    },
    appName: {
      fontFamily: 'LuckiestGuy',
      color: '#fff',
      fontSize: .15 * windowWidth, 
      marginBottom: .02 * windowWidth,
      marginTop: .015 * windowWidth
    },
    arrowStylesContainer: {
      resizeMode: 'contain',
      zIndex: 1,
      position: 'absolute',
    },
    cardContainer: {
      flexDirection: 'row',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ translateX: 1.07 * windowWidth }]
    },
    cardsContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }
  })

  const netInfo = useNetInfo();
  let componentTimeout;
  
  // Fetching saved language
  useEffect(() => {
    const fetchData = async () => {
      const lang = await readLanguage();
      setCurrentLang(lang);

      const terms = await readTerms();
      setTerms(terms);

      componentTimeout = setTimeout(() => setComponentLoaded(true), 50)
    };

    fetchData(); 

    return () => {
      clearTimeout(componentTimeout)
    };
  }, []);

  // Saving language to local storage after change
  useEffect(() => {
    saveLanguage(currentLang);
  }, [currentLang]);

  const amountOfGames = CardsData[0].en.length - 1;

  // Function which is setting previous game card as main card
  const previousGame = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }

    // If card is flipped reset flipped status
    flipped && setResetFlipped(true);
  };
  
  // Function which is setting next game card as main card
  const nextGame = () => {
    if (currentCard < amountOfGames) {
      setCurrentCard(currentCard + 1);
    }

    // If card is flipped reset flipped status
    flipped && setResetFlipped(true);
  };
  
  // If font isn't loaded then return null.
  if (!fontsLoaded && !componentLoaded) {
    return null;
  }

  // Changing current game by finger swipe
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      // Retrieving the horizontal distance of the gesture
      const distance = gestureState.dx;
      // Calculating the threshold for swipe gesture left or right
      const threshold = .25 * windowWidth;

      // Checking if the distance exceeds the threshold to determine whether to change the card
      if (distance > threshold) {
        previousGame();
      } else if (distance < -threshold) {
        nextGame();
      }
    },
  });

  // Display loading screen if component or fonts are not loaded
  if (!fontsLoaded || !componentLoaded) {
    return <LoadingScreen />;
  }

  // Display internet error screen if there is no internet connection
  if (!netInfo) {
    return <ConnectionErrorScreen />;
  }
  
  // Display terms screen if there aren't accepted
  if (!terms && componentLoaded) {
    return <TermsScreen />;
  }

  return (
    <View>
      <StatusBar backgroundColor='#000' style="light" />
      <Nav setCurrentLang={setCurrentLang} currentLang={currentLang} main={true} />

      <View {...panResponder.panHandlers}>
        <ScrollView contentContainerStyle={styles.mainContainer}>
          <Image style={styles.logoImage} source={require('../assets/icons/logo.png')}/>
          <Text style={styles.appName}>Purp</Text>
          <View style={ styles.cardsContainer }>
            <Pressable onPress={previousGame} style={[styles.arrowStylesContainer, { left: 0.005 * windowWidth, display: currentCard===0 ? 'none' : 'block' }]}><Image style={{ resizeMode: 'contain', width: .08 *windowWidth, left: 12, transform: [{ rotate: '180deg' }] }} source={require('../assets/icons/slideGameArrow.png')}/></Pressable>
            <View style={styles.cardContainer}>
              <Cards resetFlipped={resetFlipped} setResetFlipped={setResetFlipped} flipped={flipped} setFlipped={setFlipped} currentCard={currentCard} currentLang={currentLang} setCurrentLang={setCurrentLang} previousGame={previousGame} nextGame={nextGame} />
            </View>
            <Pressable onPress={nextGame} style={[styles.arrowStylesContainer, { right: 0.045 * windowWidth, display: currentCard===amountOfGames ? 'none' : 'block' }]}><Image style={{ width: .08 *windowWidth, resizeMode: 'contain' }} source={require('../assets/icons/slideGameArrow.png')}/></Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default index;
