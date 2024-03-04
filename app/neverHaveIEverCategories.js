import React, { useState, useEffect } from 'react';
import Nav from  './components/nav'; // Import Nav component
import CategoriesCard from './components/neverHaveIEverCategoriesCard'; // Import game categories cards component
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useFonts } from "expo-font";
import { readLanguage } from './scripts/language'; // Import current language from local storage
import { saveCategories } from './scripts/categories'; // Import function saveCategories to saving categories to local storage
import { Link } from 'expo-router';
import LoadingScreen from './loadingScreen'; // Import loading screen component

function neverHaveIEverCategories() {
  // Set variable with window width
  const { width: windowWidth } = useWindowDimensions();

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
      fontSize: .1 * windowWidth, 
      marginTop: .08 * windowWidth, 
      marginBottom: .06 * windowWidth 
    },
    categoriesCardsContainer: {
      width: '95%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: .03 * windowWidth
    },
    categoriesErrorText: {
      color: "#E40000",
      fontFamily: "LuckiestGuy",
      marginTop: .1 * windowWidth,  
      fontSize: .045 * windowWidth
    },
    CategoriesButtonContainer: {
      backgroundColor: '#6C1EC5',
      width: '96%',
      paddingVertical: .02 * windowWidth,
      borderRadius: .035 * windowWidth,
      textAlign: 'center',
    },
    CategoriesButtonText: {
      textAlign: 'center',
      fontSize: .07 * windowWidth,
      fontFamily: 'LuckiestGuy',
      color: '#fff',
    },
  })

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

  // Load fonts 
  const [fontsLoaded] = useFonts({
    'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
  });
  
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
    const fetchData = async () => {
      const lang = await readLanguage();
      setCurrentLang(lang);

      setTimeout(() => setComponentLoaded(true), 50)
    };

    fetchData();

    // Hiding error message on component load
    setEmptyCategoriesErrOnLoad(false)
  }, []);

  // Saving selected categories to local storage after change
  useEffect(() => {
    const areCategoriesValidJSON = Array.isArray(selectedCategories) ||
      (typeof selectedCategories === 'object' && selectedCategories !== null);

    if (areCategoriesValidJSON) {
      saveCategories(selectedCategories);
    } else {
      console.error('Nieprawidłowe dane kategorii:', selectedCategories);
    }
  }, [selectedCategories]);

  // Display loading screen if component or fonts are not loaded
  if (!fontsLoaded || !componentLoaded) {
    return <LoadingScreen/>;
  }

  return (
    <View>
        <Nav currentLang={currentLang} main={false} />
        <View style={styles.categoriesContainer}>
            <Text style={styles.categoriesHeader}>{currentLang === 'pl' ? 'Wybierz kategorie do gry' : 'Select a category for the game'}</Text>

            <ScrollView contentContainerStyle={styles.categoriesCardsContainer}>
              <CategoriesCard setEmptyCategoriesErr={setEmptyCategoriesErr} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} currentLang={currentLang} />


              {(emptyCategoriesErr && emptyCategoriesErrOnLoad) && <Text style={styles.categoriesErrorText}>{currentLang === 'pl' ? 'Kategorie nie mogą być puste' : 'Categories can\'t be empty'}</Text>}
              <Link style={[styles.CategoriesButtonContainer, { marginTop: !(emptyCategoriesErr && emptyCategoriesErrOnLoad) && .15 * windowWidth, marginBottom: .25 * windowWidth }]} href={emptyCategoriesErr ? '/neverHaveIEverCategories' : '/neverHaveIEver'} asChild>
                <TouchableOpacity>
                  <Text style={styles.CategoriesButtonText}>Rozpocznij grę</Text>
                </TouchableOpacity>
              </Link>

            </ScrollView>
        </View>
    </View>
  )
}

export default neverHaveIEverCategories