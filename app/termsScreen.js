import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Linking, useWindowDimensions, TouchableOpacity } from 'react-native';
import Nav from './components/nav'; // Import Nav component
import { useFonts } from "expo-font";
import { readLanguage } from './scripts/language'; // Import language functions
import LoadingScreen from './loadingScreen'; // Import loading screen component
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

const termsScreen = (props) => {
  // Load fonts 
  const [fontsLoaded] = useFonts({
    'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
  });

  // Set variable with window width using useWindowDimensions hook
  const { width: windowWidth } = useWindowDimensions();

  // State for tracking loading component
  const [componentLoaded, setComponentLoaded] = useState(false);

  // Styles
  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: '#131313',
      width: '100%',
      alignItems: 'center',
      minHeight: 2 * windowWidth,
    },
    textBox: {
      marginTop: props.isTablet ? .07 * windowWidth : .2 * windowWidth,
      width: '80%',
      alignItems: 'center',
      backgroundColor: '#1F152E',
      paddingHorizontal: .06 * windowWidth,
      paddingVertical: props.isTablet ? .06 * windowWidth : .1 * windowWidth,
      borderRadius: .08 * windowWidth, 
      borderWidth: .01 * windowWidth, 
      borderColor: '#fff'
    },
    header: {
      fontSize: props.isTablet ? .1 * windowWidth : .13 * windowWidth,
      fontFamily: 'LuckiestGuy',
      color: '#fff',
    },
    mainText: {
      fontSize: props.isTablet ? .045 * windowWidth : .054 * windowWidth,
      fontFamily: 'LuckiestGuy',
      color: '#fff',
      textAlign: 'center',
      marginTop: .02 * windowWidth,
      lineHeight: props.isTablet ? .055 * windowWidth : .065 * windowWidth
    },
    acceptButton: {
      width: '100%',
      marginTop: props.isTablet ? .08 * windowWidth : .11 * windowWidth,
      backgroundColor: '#6C1EC5',
      borderColor: '#fff',
      borderRadius: .045 * windowWidth, 
      borderWidth: props.isTablet ? .006 * windowWidth : .007 * windowWidth, 
      paddingVertical: .01 * windowWidth,
    }, 
    buttonText: {
      fontSize: props.isTablet ? .05 * windowWidth : .06 * windowWidth,
      fontFamily: 'LuckiestGuy',
      color: '#fff',
      textAlign: 'center',
    }
  })

  let componentTimeout;
  
  // Fetching saved language
  useEffect(() => {
    const fetchData = async () => {
      const lang = await readLanguage();
      props.setCurrentLang(lang);

      componentTimeout = setTimeout(() => setComponentLoaded(true), 50)
    };

    fetchData(); 

    return () => {
      clearTimeout(componentTimeout)
    };
  }, []);

  function privacyLink() {
    if(props.currentLang==="pl") {
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
    <View style={{backgroundColor: '#131313'}}>
      <StatusBar backgroundColor='#000' style="light" />
      <Nav setCurrentLang={props.setCurrentLang} currentLang={props.currentLang} main={true} contact='none'/>

      <ScrollView contentContainerStyle={styles.mainContainer}>

        <View style={styles.textBox}>
          <Text style={styles.header}>{props.currentLang === 'pl' ? 'Cześć!' : 'Hey!'}</Text>
          <Text style={styles.mainText}>
            {props.currentLang === 'pl' ? 
              `Przed rozpoczęciem gry, przeczytaj i zaakceptuj naszą ` : 
              `Before starting the game, please read and accept our `}
            <Text onPress={() => privacyLink()} style={{color: '#03baf8'}}>
              {props.currentLang === 'pl' ? `politykę prywatności` : `privacy policy`}
            </Text>
              {props.currentLang === 'pl' ? 
                ` która zawiera warunki korzystania z naszej aplikacji i wyjaśnia sposób przetwarzania danych. Politykę możesz również znaleźć w sekcji "O aplikacji"` : 
                `, which contains the terms of use of our application and explains how data is processed. You can also find the policy in the "About app" section.`}
          </Text>
          <Link asChild href='/'>
            <TouchableOpacity style={styles.acceptButton} onPress={() => props.setTerms(true)}>
                <Text style={styles.buttonText}>{props.currentLang === 'pl' ? 'akceptuje' : 'accept'}</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}

export default termsScreen;
