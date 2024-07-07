import { View, Text, StyleSheet, useWindowDimensions, Image, Pressable, Linking, ScrollView  } from 'react-native'
import React, { useState, useEffect } from 'react'
import Nav from './components/nav'
import { readLanguage } from './scripts/language'; // Import language functions
import { useFonts } from "expo-font";
import LoadingScreen from './loadingScreen'; // Import loading screen component
import useNetInfo from './scripts/checkConnection'
import { StatusBar } from 'expo-status-bar';

const contact = () => {
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
      marginTop: isTablet ? .04 * windowWidth : .07 * windowWidth
    },
    boxHeader: {
      color: '#fff',
      fontFamily: 'LuckiestGuy',
      fontSize: isTablet ? .06 * windowWidth : .1 * windowWidth, 
      marginBottom: .025 * windowWidth
    },
    boxEmail: {
      color: '#fff',
      fontFamily: 'LuckiestGuy',
      fontSize: isTablet ? .038 * windowWidth : .043 * windowWidth
    },
    iconsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    socialMediaIcon: {
      resizeMode: 'contain',
      width: isTablet ? .09 * windowWidth : .12 * windowWidth,
      height: isTablet ? .09 * windowWidth : .12 * windowWidth,
    }
  });

  const netInfo = useNetInfo();
  // Fetching saved language
  useEffect(() => {
    let componentTimeout;

    const fetchData = async () => {
      const lang = await readLanguage();
      setCurrentLang(lang);

      setIsTablet(windowWidth>=600)

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

  // Display internet connection error screen if there is no internet connection
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
    <View style={{backgroundColor: '#131313'}}>
      <StatusBar backgroundColor='#000' style="light" />
      <Nav isTablet={isTablet} contact={true} currentLang={currentLang}/>
      <ScrollView contentContainerStyle={styles.mainContainer}>
        <View style={[styles.boxContainer, { marginTop: isTablet ? .08 * windowWidth : .13 * windowWidth }]}>
          <Text style={styles.boxHeader}>{currentLang === 'pl' ? 'Kontakt' : 'Contact'}</Text>
          <Text style={styles.boxEmail}>contact.purp.app@gmail.com</Text>
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
      </ScrollView>

    </View>
  )
}

export default contact