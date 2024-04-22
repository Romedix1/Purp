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
  
  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: '#131313',
      alignItems: 'center',
      minHeight: 3 * windowWidth,
    },
    boxContainer: {
      backgroundColor: '#300066',
      borderColor: "#fff",
      borderWidth: .006 * windowWidth,
      borderRadius: .07 * windowWidth,
      width: .8 * windowWidth, 
      paddingHorizontal: .05 * windowWidth, 
      paddingVertical: .05 * windowWidth, 
      marginTop: .06 * windowWidth
    },
    usedIcons: {
      fontFamily: 'LuckiestGuy',
      color: '#fff',
      fontSize: .045 * windowWidth
    },
    iconLink: {
      color: '#fff',
      fontSize: .04 * windowWidth,
      fontFamily: 'LuckiestGuy',
      marginTop: .02 * windowWidth,
    },
    iconDetails: {
      color: '#fff',
      fontSize: .04 * windowWidth,
      fontFamily: 'LuckiestGuy',
      marginTop: .08 * windowWidth,
    }
  });

  // Set current lang default is english
  const [currentLang, setCurrentLang] = useState("en");
  // State for tracking loading component
  const [componentLoaded, setComponentLoaded] = useState(false);

  // Load fonts 
  const [fontsLoaded] = useFonts({
    'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
  });  

  const netInfo = useNetInfo();
  // Fetching saved language
  useEffect(() => {
    let componentTimeout

    const fetchData = async () => {
      const lang = await readLanguage();
      setCurrentLang(lang);

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

  // Display internet error screen if there is no internet connection
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

  function flagsLink() {
    Linking.openURL('https://www.figma.com/community/file/1048528064393814860/country-flag-icons');
  };

  function backArrowLink() {
    Linking.openURL('https://www.figma.com/community/file/1215889216487938265/arrows-icons');
  };

  function addPlayersLink() {
    Linking.openURL('https://www.figma.com/community/file/886554014393250663/free-icon-pack-1700-icons');
  };

  function socialMediaLink() {
    Linking.openURL('https://www.figma.com/community/file/839558611085349133/social-media-icons');
  };

  function categoriesAndCardsLink() {
    Linking.openURL('https://www.figma.com/community/file/1250363326901764746/4-000-free-open-source-icons-community');
  };
  
  return (
    <View>
      <StatusBar backgroundColor='#000' style="light" />
      <Nav contact={false} currentLang={currentLang}/>
      
      <ScrollView contentContainerStyle={styles.mainContainer}>

        <View style={styles.boxContainer}>
          <Text style={styles.usedIcons}>{currentLang === 'pl' ? 'Polityka prywatności aplikacji: ' : 'Privacy Policy of the Application: '}</Text>
          <Text style={styles.iconLink} onPress={() => fontLink()}>https://docs.google.com/document/d/1PphaovaE3l_8B-WfUIS2a0zXi5ZcAH0MW5hAgTLXrm0/edit?usp=sharing</Text>
        </View>

        <View style={styles.boxContainer}>
          <Text style={styles.usedIcons}>{currentLang === 'pl' ? 'Licencja czcionki do pobrania: ' : 'Font license to download '}</Text>
          <Text style={styles.iconLink} onPress={() => privacyLink()}>{currentLang === 'pl' ? 'https://docs.google.com/document/d/1XWKVwW5c7qOJeed8sHawfWCIWTOuZ8OFlQiDQhK-mhU/edit?usp=sharing' : 'https://docs.google.com/document/d/1nnWG01UBXcyjic5eXIGi576gavVUDgucaMj-rgzJpFI/edit?usp=sharing'}</Text>
        </View>

        <View style={styles.boxContainer}>
          <Text style={styles.usedIcons}>{currentLang === 'pl' ? 'Ikona flagi polski i anglii jest udostępniona na licencji ' : 'Icon of Polish and English flag is shared on license '}CC BY 4.0 DEED Attribution 4.0 International</Text>
          <Text style={styles.iconLink} onPress={() => flagsLink()}>{currentLang === 'pl' ? 'Więcej informacji' : 'More informations'}</Text>
        </View>

        <View style={styles.boxContainer}>
          <Text style={styles.usedIcons}>{currentLang === 'pl' ? 'Ikona powrotu z nawigacji jest udostępniona na licencji ' : 'Icon of going back in navigation is shared on license '}CC BY 4.0 DEED Attribution 4.0 International</Text>
          <Text style={styles.iconLink} onPress={() => backArrowLink()}>{currentLang === 'pl' ? 'Więcej informacji' : 'More informations'}</Text>
        </View>
          
        <View style={styles.boxContainer}>
          <Text style={styles.usedIcons}>
            {currentLang === 'pl' ? (
              <>
                Ikona z karty nigdy przenigdy, z karty 7 sekund, z karty prawda czy wyzwanie, z kategorii podróże, z kategorii gry komputerowe, z kategorii edukacja, z kategorii dla par
                <Text style={{ color: "#FF0000" }}>*</Text>, błędu połączenia z bazą danych, błędu połączenia jest udostępniona na licencji CC BY 4.0 DEED Attribution 4.0 International
              </>
            ) : (
              <>
                Icon from card of game never have i ever, seven seconds, truth or dare, categories travels, computer games and education, for couples<Text style={{ color: "#FF0000" }}>*</Text>, error 
                about not having connection with database and error with not having wifi connection is shared on license CC BY 4.0 DEED Attribution 4.0 International
              </>
            )}
            
          </Text>
          <Text style={styles.iconLink} onPress={() => categoriesAndCardsLink()}>{currentLang === 'pl' ? 'Więcej informacji' : 'More informations'}</Text>
        </View>

        <View style={styles.boxContainer}>
          <Text style={styles.usedIcons}>{currentLang === 'pl' ? 'Ikona dodania gracza, usunięcia gracza, jest udostępniona na licencji ' : 'Icon of adding player, removing player is shared on '}CC BY 4.0 DEED Attribution 4.0 International</Text>
          <Text style={styles.iconLink} onPress={() => addPlayersLink()}>{currentLang === 'pl' ? 'Więcej informacji' : 'More informations'}</Text>
        </View>

        <View style={styles.boxContainer}>
          <Text style={styles.usedIcons}>{currentLang === 'pl' ? 'Ikona instagrama, tiktoka, discorda jest udostępniona na licencji ' : 'Icon of Instagram,Tiktok and discord is shared on license '}CC BY 4.0 DEED Attribution 4.0 International</Text>
          <Text style={styles.iconLink} onPress={() => socialMediaLink()}>{currentLang === 'pl' ? 'Więcej informacji' : 'More informations'}</Text>
        </View>

        <View style={{width: '80%'}}>
          <Text style={styles.iconDetails}>* {currentLang === 'pl' ? 'element został zmieniony: usunięto, dodano, połączono, a także dodano serce na górze ' : 'element was changed: removed, added, connected and added heart on top '}</Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default aboutApp