import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Pressable, ScrollView, Linking, useWindowDimensions, PanResponder, TouchableOpacity } from 'react-native';
import Nav from './components/nav'; // Import Nav component
import { useFonts } from "expo-font";
import Cards from './components/mainCards'; // Import game cards component
import { readLanguage, saveLanguage } from './scripts/language'; // Import language functions
import { saveTerms } from './scripts/terms'; // Import language functions
import CardsData from './components/mainCardsData.json'; // Import game cards data component
import LoadingScreen from './loadingScreen'; // Import loading screen component
import ConnectionErrorScreen from './connectionError'; // Import connection error screen component
import useNetInfo from './scripts/checkConnection'
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

const termsScreen = () => {
  // Load fonts 
  const [fontsLoaded] = useFonts({
    'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
  });

  // Set variable with window width using useWindowDimensions hook
  const { width: windowWidth } = useWindowDimensions();

  // Set current language (default is english)
  const [currentLang, setCurrentLang] = useState("en");
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
      minHeight: 2 * windowWidth,
    },
    textBox: {
      marginTop: .2 * windowWidth,
      width: '80%',
      alignItems: 'center',
      backgroundColor: '#1F152E',
      paddingHorizontal: .06 * windowWidth,
      paddingVertical: .1 * windowWidth,
      borderRadius: .08 * windowWidth, 
      borderWidth: .01 * windowWidth, 
      borderColor: '#fff'
    },
    header: {
      fontSize: .13 * windowWidth,
      fontFamily: 'LuckiestGuy',
      color: '#fff',
    },
    mainText: {
      fontSize: .054 * windowWidth,
      fontFamily: 'LuckiestGuy',
      color: '#fff',
      textAlign: 'center',
      marginTop: .02 * windowWidth
    },
    acceptButton: {
      width: '100%',
      marginTop: .11 * windowWidth,
      backgroundColor: '#6C1EC5',
      fontSize: .06 * windowWidth,
      fontFamily: 'LuckiestGuy',
      color: '#fff',
      borderColor: '#fff',
      borderRadius: .045 * windowWidth, 
      borderWidth: .007 * windowWidth, 
      textAlign: 'center',
      paddingTop: .025 * windowWidth,
      paddingBottom: .01 * windowWidth,
    }
  })

  let componentTimeout;
  
  // Fetching saved language
  useEffect(() => {
    const fetchData = async () => {
      const lang = await readLanguage();
      setCurrentLang(lang);

      componentTimeout = setTimeout(() => setComponentLoaded(true), 50)
    };

    fetchData(); 

    return () => {
      clearTimeout(componentTimeout)
    };
  }, []);

  function privacyLink() {
    if(currentLang==="pl") {
      Linking.openURL('https://docs.google.com/document/d/1XWKVwW5c7qOJeed8sHawfWCIWTOuZ8OFlQiDQhK-mhU/edit?usp=sharing');
    } else {
      Linking.openURL('https://docs.google.com/document/d/1nnWG01UBXcyjic5eXIGi576gavVUDgucaMj-rgzJpFI/edit?usp=sharing');
    }
  };

  // Display loading screen if component or fonts are not loaded
  if (!fontsLoaded || !componentLoaded) {
    return <LoadingScreen />;
  }

  return (
    <View>
      <StatusBar backgroundColor='#000' style="light" />
      <Nav setCurrentLang={setCurrentLang} currentLang={currentLang} main={true} contact='none'/>

      <ScrollView contentContainerStyle={styles.mainContainer}>

        <View style={styles.textBox}>
          <Text style={styles.header}>{currentLang === 'pl' ? 'Cześć!' : 'Hey!'}</Text>
          <Text style={styles.mainText}>
            {currentLang === 'pl' ? 
              `Przed rozpoczęciem gry, przeczytaj i zaakceptuj naszą ` : 
              `Before starting the game, please read and accept our `}
            <Text onPress={() => privacyLink()} style={{color: '#03baf8'}}>
              {currentLang === 'pl' ? `politykę prywatności` : `privacy policy`}
            </Text>
              {currentLang === 'pl' ? 
                ` która zawiera warunki korzystania z naszej aplikacji i wyjaśnia sposób przetwarzania danych. Politykę możesz również znaleźć w sekcji "O aplikacji"` : 
                `, which contains the terms of use of our application and explains how data is processed. You can also find the policy in the "About app" section.`}
          </Text>
          <Link style={styles.acceptButton} href='/' asChild onPress={() => saveTerms(true)}>
              <Text>{currentLang === 'pl' ? 'akceptuje' : 'accept'}</Text>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}

export default termsScreen;
