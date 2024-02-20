import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import Nav from './components/nav'
import { readLanguage } from './scripts/language'; // Import language functions
import { useFonts } from "expo-font";
import LoadingScreen from './loadingScreen'; // Import loading screen component

const contact = () => {
  // Load fonts 
  const [fontsLoaded] = useFonts({
    'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
  });  

  // Set variable with window width and window height
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  
  // Set current lang default is english
  const [currentLang, setCurrentLang] = useState("en");
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

  // Display loading screen if component or fonts are not loaded
  if (!fontsLoaded || !componentLoaded) {
    return <LoadingScreen/>;
  }

  return (
    <View>
      <Nav contact={true} />
      <View style={[styles.mainContainer, { minHeight: 2 * windowWidth }]}>
        <View style={[styles.boxContainer, { width: .8 * windowWidth, paddingHorizontal: .07 * windowWidth, paddingVertical: .03 * windowWidth, marginTop: .13 * windowWidth }]}>
          <Text style={[styles.boxHeader, { fontSize: .1 * windowWidth }]}>{currentLang === 'pl' ? 'Kontakt' : 'Contact'}</Text>
          <Text style={[styles.boxEmail, { fontSize: .05 * windowWidth }]}>purp.app.contact@gmail.com</Text>
        </View>

        <View style={[styles.boxContainer, { width: .8 * windowWidth, paddingHorizontal: .07 * windowWidth, paddingVertical: .03 * windowWidth, marginTop: .07 * windowWidth }]}>
          <Text style={[styles.boxHeader, { fontSize: .1 * windowWidth }]}>Social media</Text>
          <Text style={[styles.boxEmail, { fontSize: .05 * windowWidth }]}>purp.app.contact@gmail.com</Text>
        </View>

        <View style={[styles.boxContainer, { width: .8 * windowWidth, paddingHorizontal: .07 * windowWidth, paddingVertical: .03 * windowWidth, marginTop: .07 * windowWidth }]}>
          <Text style={[styles.boxHeader, { fontSize: .1 * windowWidth }]}>{currentLang === 'pl' ? 'O nas' : 'About us'}</Text>
          <Text style={[styles.boxEmail, { fontSize: .045 * windowWidth }]}>{currentLang === 'pl' ? 'Jesteśmy' : 'We are'}</Text>
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#131313',
    alignItems: 'center',
  },
  boxContainer: {
    backgroundColor: '#300066',
    borderColor: "#fff",
    borderWidth: 3,
    borderRadius: 30,
    padding: 10,
    width: '100%',
  },
  boxHeader: {
    color: '#fff',
    fontFamily: 'LuckiestGuy',
  },
  boxEmail: {
    color: '#fff',
    fontFamily: 'LuckiestGuy',
  }
});

export default contact