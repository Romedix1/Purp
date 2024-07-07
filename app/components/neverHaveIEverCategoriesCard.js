import React from 'react'
import { Image, StyleSheet, Text, useWindowDimensions, Pressable } from 'react-native'
import CategoriesData from './neverHaveIEverCategoriesData.json'

function neverHaveIEverCategoriesCard(props) {
  // Set variable with window width using useWindowDimensions hook
  const { width: windowWidth } = useWindowDimensions();

  const styles = StyleSheet.create({
    categoriesCardContainer: {
      backgroundColor: '#41008B',
      alignItems: 'center',
      width: props.isTablet ? '31%' : '46%',
      aspectRatio: 1,
      borderRadius: 0.05 * windowWidth,
      borderWidth: 0.007 * windowWidth,
      paddingVertical: props.isTablet ? .035 * windowWidth :  .04 * windowWidth 
    },
    categoryCardIcon: {
      marginBottom: props.isTablet ? .02 * windowWidth : .05 * windowWidth,
      resizeMode: 'contain',
      height: props.isTablet ? .1 * windowWidth : .15 * windowWidth
    },
    categoryCardText: {
      textAlign: 'center',
      color: '#fff',
      fontFamily: 'LuckiestGuy',
      fontSize: props.isTablet ? .035 * windowWidth : .05 * windowWidth, 
      lineHeight: props.isTablet ? .045 * windowWidth : .07 * windowWidth
    }
  })

  return (    
    // Mapped categories from neverHaveIEverCategoriesData.json
    CategoriesData.map(lang => {
      // This line of code retrieves language data from the 'lang' object based on the current language passed as 'props.currentLang'.
      const langData = lang[props.currentLang];

      return langData.map((category, Categoryindex) => {

        // Render category icon
        const renderCategoryIcon = (categoryIcon) => {
          switch (categoryIcon) {
            case 'categoriesCouples.png':
              return require('../../assets/icons/NeverHaveIEver/categoriesCouples.png');
            case 'categoriesPcGames.png':
              return require('../../assets/icons/NeverHaveIEver/categoriesPcGames.png');
            case 'categoriesAdults.png':
              return require('../../assets/icons/NeverHaveIEver/categoriesAdults.png');
            case 'categoriesEducation.png':
              return require('../../assets/icons/NeverHaveIEver/categoriesEducation.png');
            case 'categoriesGeneral.png':
              return require('../../assets/icons/NeverHaveIEver/categoriesGeneral.png');
            case 'categoriesTravels.png':
              return require('../../assets/icons/NeverHaveIEver/categoriesTravels.png');
          }
        }

        // Checking that's category is currently selected
        const isSelected = props.selectedCategories.some(item => item.selectedCategoryName === category.categoryName);

        // Update selected categories
        function toggleCategory(name) {
          if (isSelected) {
            // Removing category from state
            props.setSelectedCategories((prev) => prev.filter(item => item.selectedCategoryName !== name));
          } else {
            // Adding category to state
            props.setSelectedCategories((prev) => [...prev, { selectedCategoryName: name }]);
          }
        }



        return (
          <Pressable onPress={() => toggleCategory(category.categoryName)} key={Categoryindex} style={[styles.categoriesCardContainer, { borderColor: isSelected  ? '#FF0AE6' : '#41008B'}]}>
            <Image style={styles.categoryCardIcon} source={renderCategoryIcon(category.categoryIcon)} />
              <Text style={styles.categoryCardText}>{category.categoryName}</Text>
            </Pressable>
        )
      })
            
    })
  )
}

export default neverHaveIEverCategoriesCard