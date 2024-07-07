import React from "react";
import { Link } from 'expo-router';
import { View, Image, StyleSheet, Pressable, useWindowDimensions, Text, Animated  } from "react-native";
import CategoriesData from './neverHaveIEverCategoriesData.json' // Import never have i ever categories data

export default function Nav(props) {
  // Set variable with window width using useWindowDimensions hook
  const { width: windowWidth } = useWindowDimensions();

  // Styles
  const styles = StyleSheet.create({
    navContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#090909',
      zIndex: 3, 
      position: 'relative',
      padding: props.isTablet ? .03 * windowWidth : .05 * windowWidth,
    },
    currentFlag: {
      width: props.isTablet ? .09 * windowWidth : .12 * windowWidth, 
      height: props.isTablet ? .055 * windowWidth : .08 * windowWidth
    },
    backArrow: {
      width: props.isTablet ? .11 * windowWidth : .13 * windowWidth, 
      height: props.isTablet ? .08 * windowWidth : .09 * windowWidth, 
      marginLeft:  -(.025 * windowWidth)
    },
    navRightText: {
      fontFamily: 'LuckiestGuy',
      color: "#fff",
      fontSize: props.isTablet ? .035 * windowWidth : .05 * windowWidth,
    },
    selectCategoriesContainer: {
      zIndex: 8, 
      position: 'relative'
    },
    selectCategoriesArrow: {
      resizeMode: 'contain',
      height: props.isTablet ? .04 * windowWidth : .06 * windowWidth, 
      width: props.isTablet ? .04 * windowWidth : .06 * windowWidth, 
      marginHorizontal: .01 * windowWidth,
      marginRight: .04 * windowWidth
    },
    selectCategoriesHeader: {
      fontFamily: 'LuckiestGuy', 
      color: '#FFF'
    },
    selectCategories: {
      backgroundColor: '#41008B',
      borderRadius: 999,
      flexDirection: 'row', 
      alignItems: 'center',
      height: props.isTablet ? .07 * windowWidth : .1 * windowWidth, 
      paddingLeft: .025 * windowWidth, 
      paddingRight: .04 * windowWidth, 
    },
    selectCategoriesOpenedContainer: {
      zIndex: 6, 
      borderColor: '#41008B', 
      position: 'absolute',
      overflow: 'hidden', 
      backgroundColor: '#191125', 
      width: '100%',
      borderWidth: .01 * windowWidth, 
      borderBottomLeftRadius: .05 * windowWidth, 
      borderBottomRightRadius: .05 * windowWidth, 
      borderTopLeftRadius: .02 * windowWidth, 
      borderTopRightRadius: .02 * windowWidth, 
      top: .031 * windowWidth 
    },
    categoriesMenuText: {
      fontFamily: 'LuckiestGuy', 
      textAlign:'center',
      borderRadius: 999,
      paddingVertical: .006 * windowWidth, 
      marginVertical: props.isTablet ? .01 * windowWidth : .015 * windowWidth, 
      fontSize: props.isTablet ? .03 * windowWidth : .045 * windowWidth,
      height: props.isTablet ? .057 * windowWidth : .073 * windowWidth
    }
  });

  // Function to toggle language between polish and english
  const toggleLanguage = () => {
    props.setCurrentLang((prevLang) => (prevLang === 'pl' ? 'en' : 'pl'));
  };

  // Function to toggle category selection
  const toggleCategory = (categoryName) => {
    const isSelected = props.selectedCategories.some(item => item.selectedCategoryName === categoryName);

    if (isSelected) {
      // Remove category only if there are more than 1 selected
      if (props.selectedCategories.length > 1) {
        props.setSelectedCategories((prev) => prev.filter(item => item.selectedCategoryName !== categoryName));
      }
    } else {
      props.setSelectedCategories((prev) => [...prev, { selectedCategoryName: categoryName }]);
    }
  };

  return (
    <View style={styles.navContainer}>
      {/* If it's the main page, display the language toggle */}
      {props.main === true && 
        <Pressable onPress={() => toggleLanguage()}>
          <Image style={styles.currentFlag} source={props.currentLang === "pl" ? require('../../assets/icons/poland-flag.png') : require('../../assets/icons/england-flag.png')} />
        </Pressable>}
      
      {!props.main === true &&
      /* If it's not the main page, display the back arrow */
       <Link href={'/'}>
          <View>
            <Animated.Image style={styles.backArrow} source={require('../../assets/icons/back-arrow.png')} />
          </View>
        </Link>   
      }

      {/* If it's the neverHaveIEver component, display category selection */}
      {props.neverHaveIEver &&
        <View>
          <Pressable style={styles.selectCategoriesContainer} onPress={() => {props.toggleCategories(), props.rotateArrow()}}>
            <View style={styles.selectCategories}>
              <Animated.Image style={[styles.selectCategoriesArrow, { transform: [{ rotate: props.arrowRotateInterpolate }] }]} source={require("../../assets/icons/slideGameArrow.png")} />
              <Text style={[styles.selectCategoriesHeader, { fontSize: props.currentLang === 'pl' ? (props.isTablet ? .028 * windowWidth : .044 * windowWidth) : (props.isTablet ? .022 * windowWidth : .038 * windowWidth)}]}>{props.currentLang === 'pl' ? 'Zmień kategorie' : 'Change categories'}</Text>
            </View>
          </Pressable>
            <Animated.View style={[styles.selectCategoriesOpenedContainer, { height: props.categoriesHeight }]}>
              <View style={{ paddingTop: props.isTablet ? .06 * windowWidth : .08 * windowWidth, alignItems: 'center'}}>
                {/* Map categories from CategoriesData */}
                {CategoriesData.map(lang => {
                  const langData = lang[props.currentLang];

                  return langData.map((category, Categoryindex) => {
                    // Check if category is selected
                    const isSelected = props.selectedCategories.some(item => item.selectedCategoryName === category.categoryName);
                    
                    return (
                      <Pressable key={Categoryindex} style={{ width: props.isTablet ? '92%' : '96%' }} onPress={() => toggleCategory(category.categoryName)}>
                        <Text style={[ styles.categoriesMenuText, { backgroundColor: isSelected  ? '#41008B' : '#D9D9D9', color: isSelected  ? '#FFF' : '#000' }]}>{category.categoryName}</Text>
                      </Pressable>
                    )
                  })})}
              </View>
            </Animated.View>
        </View>
      }

      {/* If it's the contact page, display about app link otherwise, display contact link */}
      {props.contact !== 'none' && (
      <Link href={props.contact ? '/privacy' : '/contact'} style={styles.navRightText}>
        {props.contact ? (props.currentLang === 'pl' ? 'O aplikacji' : 'About app') : (props.currentLang === 'pl' ? 'Kontakt' : 'Contact')}
      </Link>
      )}
    </View>
  );
}