import React, { useState, useEffect } from 'react';
import Nav from  './components/nav'; // Import Nav component
import CategoriesCard from './components/neverHaveIEverCategoriesCard'; // Import game categories cards component
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useFonts } from "expo-font";
import { readLanguage } from './scripts/language'; // Import current language from local storage
import { saveCategories } from './scripts/categories'; // Import function saveCategories to saving categories to local storage
import ConnectionErrorScreen from './connectionError'; // Import connection error screen component
import { Link } from 'expo-router';
import LoadingScreen from './loadingScreen'; // Import loading screen component
import useNetInfo from './scripts/checkConnection'
import { StatusBar } from 'expo-status-bar';

function neverHaveIEverCategories() {
  // Set variable with window width
  const { width: windowWidth } = useWindowDimensions();

  // Set current language (default is english)
  const [currentLang, setCurrentLang] = useState("en");
  // Array of selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  // State for empty categories error handling
  const [emptyCategoriesErr, setEmptyCategoriesErr] = useState(false);
  // State for empty categories error handling on load
  const [emptyCategoriesErrOnLoad, setEmptyCategoriesErrOnLoad] = useState(false);
  // State for tracking loading component
  const [componentLoaded, setComponentLoaded] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Load fonts 
  const [fontsLoaded] = useFonts({
    'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
  });
  
  const styles = StyleSheet.create({
    categoriesContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: '#131313',
      alignItems: 'center',
    },
    categoriesHeader: {
      width: '90%',
      textAlign: 'center',
      color: "#fff",
      fontFamily: 'LuckiestGuy',
      fontSize: isTablet ? .065 * windowWidth : .1 * windowWidth, 
      marginTop: isTablet ? .045 * windowWidth : .08 * windowWidth, 
      marginBottom: isTablet ? .05 * windowWidth : .06 * windowWidth 
    },
    categoriesCardsContainer: {
      width: '95%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: isTablet ? .02 * windowWidth : .03 * windowWidth
    },
    categoriesErrorText: {
      width: '90%',
      textAlign: 'center',
      color: "#E40000",
      fontFamily: "LuckiestGuy",
      marginTop: isTablet ? .07 * windowWidth : .1 * windowWidth,  
      fontSize: isTablet ? .04 * windowWidth : .045 * windowWidth
    },
    CategoriesButtonContainer: {
      backgroundColor: '#6C1EC5',
      width: '96%',
      paddingVertical: isTablet ? .015 * windowWidth : .02 * windowWidth,
      borderRadius: .035 * windowWidth,
      textAlign: 'center',
    },
    CategoriesButtonText: {
      textAlign: 'center',
      fontSize: isTablet ? .05 * windowWidth : .07 * windowWidth,
      fontFamily: 'LuckiestGuy',
      color: '#fff',
    },
  })

  const netInfo = useNetInfo();

  // Checking length of categories if it's equel to 0 then error is displayed (checking every categories update)
  useEffect(() => {
    if(selectedCategories.length === 0)
    {
      setEmptyCategoriesErr(true)
      setEmptyCategoriesErrOnLoad(true)
    } else {
      setEmptyCategoriesErr(false)
    }
  }, [selectedCategories])

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

    // Hiding error message on component load
    setEmptyCategoriesErrOnLoad(false)
    
    return () => {
      clearTimeout(componentTimeout)
    };
  }, []);

  // Saving selected categories to local storage after change
  useEffect(() => {
    const areCategoriesValidJSON = Array.isArray(selectedCategories) ||
      (typeof selectedCategories === 'object' && selectedCategories !== null);

    if (areCategoriesValidJSON) {
      saveCategories(selectedCategories);
    }
  }, [selectedCategories]);

  // Display loading screen if component or fonts are not loaded
  if (!fontsLoaded || !componentLoaded) {
    return <LoadingScreen/>;
  }

  // Display internet connection error screen if there is no internet connection
  if (!netInfo) {
    return <ConnectionErrorScreen/>;
  }

  return (
    <View style={{backgroundColor: '#131313'}}>
        <StatusBar backgroundColor='#000' style="light" />
        <Nav isTablet={isTablet} currentLang={currentLang} main={false} />
        <View style={styles.categoriesContainer}>
            <Text style={styles.categoriesHeader}>{currentLang === 'pl' ? 'Wybierz kategorie do gry' : 'Select a categories for the game'}</Text>

            <ScrollView contentContainerStyle={styles.categoriesCardsContainer}>
              <CategoriesCard isTablet={isTablet} setEmptyCategoriesErr={setEmptyCategoriesErr} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} currentLang={currentLang} />


              {(emptyCategoriesErr && emptyCategoriesErrOnLoad) && <Text style={styles.categoriesErrorText}>{currentLang === 'pl' ? 'Należy wybrać przynajmniej 1 kategorie' : 'You must choose at least 1 category'}</Text>}
              <Link style={[styles.CategoriesButtonContainer, { marginTop: !(emptyCategoriesErr && emptyCategoriesErrOnLoad) && .15 * windowWidth, marginBottom: .25 * windowWidth }]} href={emptyCategoriesErr ? '/neverHaveIEverCategories' : '/neverHaveIEver'} asChild>
                <TouchableOpacity>
                  <Text style={styles.CategoriesButtonText}>{currentLang === 'pl' ? 'Rozpocznij grę' : 'Start game'}</Text>
                </TouchableOpacity>
              </Link>

            </ScrollView>
        </View>
    </View>
  )
}

export default neverHaveIEverCategories