import { View, Text, StyleSheet, useWindowDimensions, Image, Pressable, Linking, ScrollView  } from 'react-native'
import React, { useState, useEffect } from 'react'
import Nav from './components/nav'
import { readLanguage } from './scripts/language'; // Import language functions
import { useFonts } from "expo-font";
import LoadingScreen from './loadingScreen'; // Import loading screen component
import useNetInfo from './scripts/checkConnection'
import { StatusBar } from 'expo-status-bar';

const aboutApp = () => {
  // Set variable with window width using useWindowDimensions hook
  const { width: windowWidth } = useWindowDimensions();

  // Set current lang default is english
  const [currentLang, setCurrentLang] = useState("en");
  // State for tracking loading component
  const [componentLoaded, setComponentLoaded] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Load fonts 
  const [fontsLoaded] = useFonts({
    'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
  });  

  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: '#131313',
      alignItems: 'center',
      minHeight: isTablet ? 2 * windowWidth : 3 * windowWidth,
    },
    boxContainer: {
      backgroundColor: '#300066',
      borderColor: "#fff",
      borderWidth: .006 * windowWidth,
      borderRadius: .07 * windowWidth,
      width: .8 * windowWidth, 
      paddingHorizontal: .05 * windowWidth, 
      paddingVertical: .05 * windowWidth, 
      marginTop: isTablet ? .03 * windowWidth : .06 * windowWidth
    },
    usedIcons: {
      fontFamily: 'LuckiestGuy',
      color: '#fff',
      fontSize: isTablet ? .035 * windowWidth : .045 * windowWidth
    },
    iconLink: {
      color: '#fff',
      fontSize: isTablet ? .03 * windowWidth : .04 * windowWidth,
      fontFamily: 'LuckiestGuy',
      marginTop: .02 * windowWidth,
    }
  });

  const netInfo = useNetInfo();
  // Fetching saved language
  useEffect(() => {
    let componentTimeout

    const fetchData = async () => {
      const lang = await readLanguage();
      setCurrentLang(lang);

      setIsTablet(windowWidth>=600)

      componentTimeout = setTimeout(() => setComponentLoaded(true), 50)
    };

    fetchData();

    return () => {
      clearTimeout(componentTimeout)
    }
  }, []);

  // Display loading screen if component or fonts are not loaded
  if (!fontsLoaded || !componentLoaded) {
    return <LoadingScreen/>;
  }

  // Display internet connection error screen if there is no internet connection
  if (!netInfo) {
    return <ConnectionErrorScreen/>;
  }

  function fontLink() {
      Linking.openURL('https://docs.google.com/document/d/1PphaovaE3l_8B-WfUIS2a0zXi5ZcAH0MW5hAgTLXrm0/edit?usp=sharing');
  };

  function privacyLink() {
    if(currentLang==="pl") {
      Linking.openURL('https://docs.google.com/document/d/1XWKVwW5c7qOJeed8sHawfWCIWTOuZ8OFlQiDQhK-mhU/edit?usp=sharing');
    } else {
      Linking.openURL('https://docs.google.com/document/d/1nnWG01UBXcyjic5eXIGi576gavVUDgucaMj-rgzJpFI/edit?usp=sharing');
    }
  };

  function iconLicense() {
    if(currentLang==="pl") {
      Linking.openURL('https://docs.google.com/document/d/1hxqRnqzTChe_CVfnMw0q080RFoQKTekhlYGTWpc1eow/edit?usp=sharing');
    } else {
      Linking.openURL('https://docs.google.com/document/d/1gqu0QjegRHVT1-ekWNDlaORqLxFVx2HAPRzizuqfTgM/edit?usp=sharing');
    }
  };
  
  return (
    <View style={{backgroundColor: '#131313'}}>
      <StatusBar backgroundColor='#000' style="light" />
      <Nav isTablet={isTablet} contact={false} currentLang={currentLang}/>
      
      <ScrollView contentContainerStyle={styles.mainContainer}>

        <View style={styles.boxContainer}>
          <Text style={styles.usedIcons}>{currentLang === 'pl' ? 'Polityka prywatności aplikacji: ' : 'Privacy Policy of the Application: '}</Text>
          <Text style={styles.iconLink} onPress={() => privacyLink()}>https://docs.google.com/document/d/1PphaovaE3l_8B-WfUIS2a0zXi5ZcAH0MW5hAgTLXrm0/edit?usp=sharing</Text>
        </View>

        <View style={styles.boxContainer}>
          <Text style={styles.usedIcons}>{currentLang === 'pl' ? 'Licencja czcionki Luckiest Guy: ' : 'Font license for Luckiest Guy: '}</Text>
          <Text style={styles.iconLink} onPress={() => fontLink()}>{currentLang === 'pl' ? 'https://docs.google.com/document/d/1XWKVwW5c7qOJeed8sHawfWCIWTOuZ8OFlQiDQhK-mhU/edit?usp=sharing' : 'https://docs.google.com/document/d/1nnWG01UBXcyjic5eXIGi576gavVUDgucaMj-rgzJpFI/edit?usp=sharing'}</Text>
        </View>


        <View style={styles.boxContainer}>
          <Text style={styles.usedIcons}>{currentLang === 'pl' ? 'Plik z licencjami ikon: ' : 'Icon license file:  '}</Text>
          <Text style={styles.iconLink} onPress={() => iconLicense()}>{currentLang === 'pl' ? 'https://docs.google.com/document/d/1hxqRnqzTChe_CVfnMw0q080RFoQKTekhlYGTWpc1eow/edit?usp=sharing' : 'More informations'}</Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default aboutApp