import { View, Text, StyleSheet, useWindowDimensions, Image, Pressable, Linking, ScrollView  } from 'react-native'
import React, { useState, useEffect } from 'react'
import Nav from './components/nav'
import { readLanguage } from './scripts/language'; // Import language functions
import { useFonts } from "expo-font";
import LoadingScreen from './loadingScreen'; // Import loading screen component
import useNetInfo from './scripts/checkConnection'

const contact = () => {
  // Set variable with window width using useWindowDimensions hook
  const { width: windowWidth } = useWindowDimensions();
  
  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: '#131313',
      alignItems: 'center',
      minHeight: 2 * windowWidth
    },
    boxContainer: {
      backgroundColor: '#300066',
      borderColor: "#fff",
      borderWidth: .006 * windowWidth,
      borderRadius: .07 * windowWidth,
      padding: .015 * windowWidth,
      width: .8 * windowWidth, 
      paddingHorizontal: .07 * windowWidth, 
      paddingVertical: .05 * windowWidth, 
      marginTop: .07 * windowWidth
    },
    boxHeader: {
      color: '#fff',
      fontFamily: 'LuckiestGuy',
      fontSize: .1 * windowWidth, 
      marginBottom: .025 * windowWidth
    },
    boxEmail: {
      color: '#fff',
      fontFamily: 'LuckiestGuy',
      fontSize: .043 * windowWidth
    },
    iconsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    socialMediaIcon: {
      resizeMode: 'contain',
      width: .12 * windowWidth,
      height: .12 * windowWidth,
    },
    aboutUs: {
      fontFamily: 'LuckiestGuy',
      color: '#fff',
      fontSize: .05 * windowWidth,
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
    let componentTimeout;

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

  // Display loading screen if component or fonts are not loaded
  if (!fontsLoaded || !componentLoaded) {
    return <LoadingScreen/>;
  }

  // Display internet error screen if there is no internet connection
  if (!netInfo) {
    return <ConnectionErrorScreen/>;
  }

  // Open discord invite
  function discordLink() {
    Linking.openURL('https://discord.gg/SNz8kmnBrE');
  };

  // Open instagram link
  function instagramLink() {
    Linking.openURL('https://www.instagram.com/purppartygames/');
  };

  // Open tiktok link
  function tiktokLink() {
    Linking.openURL('https://www.tiktok.com/@purppartygames');
  };

  return (
    <View>
      <Nav contact={true} currentLang={currentLang}/>
      <ScrollView contentContainerStyle={styles.mainContainer}>
        <View style={[styles.boxContainer, { marginTop: .13 * windowWidth }]}>
          <Text style={styles.boxHeader}>{currentLang === 'pl' ? 'Kontakt' : 'Contact'}</Text>
          <Text style={[styles.boxEmail, {  }]}>contact.purp.app@gmail.com</Text>
        </View>

        <View style={styles.boxContainer}>
          <Text style={styles.boxHeader}>Social media</Text>
          <View style={styles.iconsContainer}>
            <Pressable onPress={() => discordLink()}>
              <Image style={styles.socialMediaIcon} source={require('../assets/icons/discordIcon.png')} />              
            </Pressable>

            <Pressable onPress={() => instagramLink()}>
              <Image style={styles.socialMediaIcon} source={require('../assets/icons/instagramIcon.png')} />
            </Pressable>

            <Pressable onPress={() => tiktokLink()}>
              <Image style={styles.socialMediaIcon} source={require('../assets/icons/tiktokIcon.png')} />
            </Pressable>
          </View>
        </View>

        <View style={styles.boxContainer}>
          <Text style={styles.boxHeader}>{currentLang === 'pl' ? 'O nas' : 'About us'}</Text>
          <Text style={styles.aboutUs}>{currentLang === 'pl' ? 'Jesteśmy' : 'We are'}</Text>
        </View>
      </ScrollView>

    </View>
  )
}

export default contact