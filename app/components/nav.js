import React from "react";
import { Link } from 'expo-router';
import { View, Image, StyleSheet, Pressable, useWindowDimensions, Text, Animated  } from "react-native";
import { useFonts } from "expo-font"; 
import CategoriesData from './neverHaveIEverCategoriesData.json' // Import never have i ever categories data

export default function Nav(props) {
  // Load fonts 
  const [fontsLoaded] = useFonts({
    'LuckiestGuy': require('../../assets/fonts/LuckiestGuy-Regular.ttf'),
  });

  // Set variable with window width
  const { width: windowWidth } = useWindowDimensions();

  return (
    <View style={[styles.navContainer, { paddingHorizontal: .05 * windowWidth, paddingVertical: .05 * windowWidth}]}>
      {/* If it's main page generate this element*/}
      {props.main === true ? 
        <Pressable onPress={() => props.toggleLanguage()}>
          <Image style={{ width: .12 * windowWidth, height: .08 * windowWidth }} source={props.currentLang === "pl" ? require('../../assets/icons/poland-flag.png') : require('../../assets/icons/england-flag.png')} />
        </Pressable>
      : 
        // If it isn't main page then this element is generated (arrow to main page)
        <Link href={'/'}>
          <View>
            <Image style={[styles.iconImageArrow, { width: .13 * windowWidth, height: .09 * windowWidth }]} source={require('../../assets/icons/back-arrow.png')} />
          </View>
        </Link>   
      }

      {/* If it's neverHaveIEver component generate this element */}
      {props.neverHaveIEver && 
        <View>
          <Pressable style={styles.navSelectCategoriesContainer} onPress={() => props.toggleCategories()}>
            <View style={[styles.navSelectCategories,{ height: .1 * windowWidth, paddingLeft: .025 * windowWidth, paddingRight: .04 * windowWidth, }]}>
              <Image style={{ transform: [{ rotate: '90deg' }, { scale: 0.001 * windowWidth }], marginRight: 0.015 * windowWidth }} source={require("../../assets/icons/slideGameArrow.png")} />
              <Text style={[styles.navSelectCategoriesHeader, {  fontSize: props.currentLang === 'pl' ? .044 * windowWidth : .038 * windowWidth}]}>{props.currentLang === 'pl' ? 'Zmień kategorie' : 'Change categories'}</Text>
            </View>
          </Pressable>
            <Animated.View style={[styles.navSelectCategoriesOpenedContainer, { height: props.categoriesHeight, width: .522 *windowWidth, top: .031 * windowWidth}]}>
              <View style={{ paddingTop: .08 * windowWidth, alignItems: 'center'}}>
                {/* Mapped categories from neverHaveIEverCategoriesData.json */}
                {CategoriesData.map(lang => {
                  const langData = lang[props.currentLang];

                  return langData.map((category, Categoryindex) => {
                    // Checking that's category is currently selected
                    const isSelected = props.selectedCategories.some(item => item.selectedCategoryName === category.categoryName);
                    
                    // Update selected categories
                    function toggleCategory(name) {
                      if (isSelected) {
                        // Removing category from state but if you want to remove selected categories must be greater than 1
                        if(props.selectedCategories.length>1){
                          props.setSelectedCategories((prev) => prev.filter(item => item.selectedCategoryName !== name));
                        }
                      } else {
                        // Adding category to state
                        props.setSelectedCategories((prev) => [...prev, { selectedCategoryName: name }]);
                      }
                    }

                    return (
                      <Pressable key={Categoryindex} style={{ width: '95%' }} onPress={() => toggleCategory(category.categoryName)}>
                        <Text style={[ styles.navCategoriesMenuText,{ backgroundColor: isSelected  ? '#41008B' : '#D9D9D9', color: isSelected  ? '#FFF' : '#000', paddingVertical: 0.006 * windowWidth, marginVertical: 0.015 * windowWidth, fontSize: .045 * windowWidth}]}>{category.categoryName}</Text>
                      </Pressable>
                    )
                  })})}
              </View>
            </Animated.View>
        </View>
      }

      {/* If it's contact page generate text with privacy policy else it's privact page generate contact text */}
      <Link href={props.contact ? '/privacy' : '/contact'} style={[styles.navRightText, { fontSize: .05 * windowWidth, }]}>
        {props.contact ? props.currentLang === 'pl' ? 'Polityka prywatności' : 'Privacy policy' : props.currentLang === 'pl' ? 'Kontakt' : 'Contact'}
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#090909',
    zIndex: 3, 
    position: 'relative'
  },

  iconImageArrow: {
    marginLeft: -10,
  },

  navRightText: {
    fontFamily: 'LuckiestGuy',
    color: "#fff",
  },

  navSelectCategoriesContainer: {
    zIndex: 8, 
    position: 'relative'
  },
  
  navSelectCategoriesHeader: {
    fontFamily: 'LuckiestGuy', 
    color: '#FFF'
  },

  navSelectCategories: {
    backgroundColor: '#41008B',
    borderRadius: 999,
    flexDirection: 'row', 
    alignItems: 'center'
  },

  navSelectCategoriesOpenedContainer: {
    zIndex: 6, 
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    borderWidth: 6, 
    borderColor: '#41008B', 
    position: 'absolute',
    overflow: 'hidden', 
    backgroundColor: '#191125', 
    width: '100%'
  },

  navCategoriesMenuText: {
    fontFamily: 'LuckiestGuy', 
    textAlign:'center',
    borderRadius: 999,
  }
});
