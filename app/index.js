import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Pressable, ScrollView, useWindowDimensions, PanResponder } from 'react-native';
import Nav from './components/nav'; // Import Nav component
import { useFonts } from "expo-font";
import Cards from './components/mainCards'; // Import game cards component
import { readLanguage, saveLanguage } from './scripts/language'; // Import language functions
import CardsData from './components/mainCardsData.json'; // Import game cards data component
import LoadingScreen from './loadingScreen'; // Import loading screen component

const Index = () => {

  // Load fonts 
  const [fontsLoaded] = useFonts({
    'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
  });
  
  // Set variable with window width
  const { width: windowWidth } = useWindowDimensions();

  // Set current lang default is english
  const [currentLang, setCurrentLang] = useState("en");
  // Set current card defualt 0 
  const [currentCard, setCurrentCard] = useState(0);
  // State for tracking whether the card is flipped default isn't flipped
  const [flipped, setFlipped] = useState(false);
  // Resetting flipped card status
  const [resetFlipped, setResetFlipped] = useState(false);
  // State for tracking loading component
  const [componentLoaded, setComponentLoaded] = useState(false);
  // State for tracking loading nav component
  const [navLoaded, setNavLoaded] = useState(false);

  // Fetching saved language
  useEffect(() => {
    const fetchData = async () => {
      const lang = await readLanguage();
      setCurrentLang(lang);

      // Set component and Nav component loaded state
      setTimeout(() => setComponentLoaded(true), 50)
      setTimeout(() => setNavLoaded(true), 50)
    };

    fetchData();   
  }, []);

  // Toggling language from polish to english and vice versa
  const toggleLanguage = () => {
    setCurrentLang((prevLang) => (prevLang === 'pl' ? 'en' : 'pl'));
  };

  // Saving language to local storage after change
  useEffect(() => {
    saveLanguage(currentLang);
  }, [currentLang]);
  
  // Number of games in app
  const amountOfGames = CardsData[0].en.length - 1;

  // Setting previous game
  const previousGame = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }

    // If card is flipped reset flipped status
    flipped && setResetFlipped(true);
  };
  
  // Setting next game
  const nextGame = () => {
    if (currentCard < amountOfGames) {
      setCurrentCard(currentCard + 1);
    }

    // If card is flipped reset flipped status
    flipped && setResetFlipped(true);
  };

  // If font isn't loaded then return null.
  if (!fontsLoaded) {
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
    return <LoadingScreen/>;
  }
  
  return (
    <View>
      <Nav toggleLanguage={toggleLanguage} currentLang={currentLang} main={true}/>

      <View {...panResponder.panHandlers}>
        <ScrollView contentContainerStyle={[styles.mainContainer, { paddingBottom: 0.3 * windowWidth }]}>
          <Image style={{ marginTop: .05 * windowWidth, transform: [{ scale: .0025* windowWidth }] }} source={require('../assets/icons/logo.png')}/>
          <Text style={[styles.appName, {fontSize: .15 * windowWidth}]}>Purp</Text>
          <View style={ styles.cardsContainer }>
            <Pressable onPress={previousGame} style={[styles.arrowStylesContainer, {left: 0.005 * windowWidth, display: currentCard===0 ? 'none' : 'block',  transform: [{ scale: .0023* windowWidth }]}]}><Image style={{ left: 12, transform: [{ rotate: '180deg' }] }} source={require('../assets/icons/slideGameArrow.png')}/></Pressable>
            <View style={[ styles.cardContainer, { transform: [{ translateX: 1.07 * windowWidth }]}]}>
              <Cards windowWidth={windowWidth} resetFlipped={resetFlipped} setResetFlipped={setResetFlipped} flipped={flipped} setFlipped={setFlipped} currentCard={currentCard} currentLang={currentLang} setCurrentLang={setCurrentLang} previousGame={previousGame} nextGame={nextGame} />
            </View>
            <Pressable onPress={nextGame} style={[styles.arrowStylesContainer, { right: 0.045 * windowWidth, display: currentCard===amountOfGames ? 'none' : 'block',  transform: [{ scale: .0023* windowWidth }]}]}><Image source={require('../assets/icons/slideGameArrow.png')}/></Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#131313',
    width: '100%',
    alignItems: 'center',
  },
  appName: {
    fontFamily: 'LuckiestGuy',
    color: '#fff',
    marginBottom: 8, 
    marginTop: 10,
  },
  arrowStylesContainer: {
    position: 'absolute', 
    zIndex: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default Index;
