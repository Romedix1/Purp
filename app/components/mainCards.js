import React, { useState, useEffect, useRef } from 'react';
import CardsData from './mainCardsData.json';
import { View, StyleSheet, Text, Image, TouchableOpacity, Animated, Easing, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';

function MainCards(props) {
  // Set variable with window width using useWindowDimensions hook
  const { width: windowWidth } = useWindowDimensions();

  // Styles
  const styles = StyleSheet.create({
    cardsContainer: {
      flexDirection: 'row',
      width: .685 * windowWidth,
      marginRight: .26 * windowWidth, 
    },
    cardContainer: {
      width: '100%',
      borderColor: '#fff',
    },
    cardFront: {
      width: '100%',
      alignItems: 'center',
      backfaceVisibility: 'hidden',
      borderWidth: .004 * windowWidth, 
      borderRadius: .08 * windowWidth, 
      paddingTop: .09 * windowWidth, 
    },
    cardBack: {
      width: '100%',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      backfaceVisibility: 'hidden',
      paddingTop: .05 * windowWidth, 
      borderRadius: .08 * windowWidth, 
      borderWidth: .004 * windowWidth, 
    },
    rulesHeader: {
      fontFamily: 'LuckiestGuy',
      fontSize: .1 * windowWidth
    },
    cardText: {
      fontFamily: 'LuckiestGuy',
      fontSize: .105 * windowWidth, 
      lineHeight: .11 * windowWidth,
    },
    cardGameRulesText: {
      width: '90%',
      fontFamily: 'LuckiestGuy',
      color: '#fff',
      textAlign: 'center',
      marginTop: .04 * windowWidth,
      marginBottom: .1 * windowWidth, 
      fontSize: .05 * windowWidth, 
      lineHeight: .075* windowWidth
    },
    cardIconContainer: {
      backgroundColor: '#0F0F0F',
      paddingHorizontal: .065 * windowWidth,
      paddingVertical: .06 * windowWidth,
      borderColor: '#262323',
      borderWidth: .01 * windowWidth,
      borderRadius: 1 * windowWidth,
      marginTop: .06 * windowWidth,
      marginBottom: .075 * windowWidth,
    },
    cardIcon: {
      resizeMode: 'contain',
      width: .2 * windowWidth,
      height: .2 * windowWidth
    },
    cardButtonContainer: {
      width: '85%',
      marginBottom: .06 * windowWidth,
      paddingVertical: .015 * windowWidth,
      borderRadius: .035 * windowWidth,
      textAlign: 'center',
    },
    cardButtonText: {
      textAlign: 'center',
      fontFamily: 'LuckiestGuy',
      color: '#fff',
      fontSize: .062 * windowWidth
    },
  });

  // Setting the state of isAnimating to true indicates that the card is currently in the process of rotating animation.
  const [isAnimating, setIsAnimating] = useState(false);

  // useRef hook to create a reference to an Animated.Value for controlling horizontal translation of cards
  const translationX = useRef(new Animated.Value(0)).current;
  // useRef hook to create a reference to an Animated.Value for controlling rotation of cards
  const rotateValue = useRef(new Animated.Value(0)).current;

  // Rotating card animation
  const rotateCard = () => {
    // If card is rotating then do nothing
    if (isAnimating) return;

    setIsAnimating(true);
    // Set rotate card value
    const toValue = props.flipped ? 360 : 180;

    // Card rotate animation details
    Animated.timing(rotateValue, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      props.setFlipped((prevFlipped) => !prevFlipped);
      props.setResetFlipped(false);
      setIsAnimating(false);
    });
  };

  useEffect(() => {

  const clearCache = () => {
    setIsAnimating(false);
    translationX.setValue(0);
    rotateValue.setValue(0);
  };

  return () => {
    clearCache();
  };
}, []);
  
  // Reset rotated card value 
  useEffect(() => {
    if (props.resetFlipped) {
      rotateCard();
    }
  }, [props.resetFlipped]);

  // Rotate card to front values
  const frontInterpolate = rotateValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  // Rotate card to back values
  const backInterpolate = rotateValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  // Set current card position
  useEffect(() => {
    const slideAnimation = Animated.timing(translationX, {
      toValue: -props.currentCard * 0.945 * windowWidth,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    slideAnimation.start();
  }, [props.currentCard]);

  return (
    <>
      {/* Mapped cards from mainCardsData.json */}
      {CardsData.map(item => {
        const langData = item[props.currentLang];
        return langData.map((card, index) => {
          const lastWordColor = card.cardNameColor;
          const lastWordIndex = card.gameName.length - 1;

          const renderGameIcon = (gameIcon) => {
            switch (gameIcon) {
              case 'neverHaveIEverIcon.png':
                return require('../../assets/icons/neverHaveIEverIcon.png');
              case '7SecondsIcon.png':
                return require('../../assets/icons/7SecondsIcon.png');
              case 'TruthOrDareIcon.png':
                return require('../../assets/icons/TruthOrDareIcon.png');
            }
          };

          return (
            <Animated.View key={index} style={[styles.cardsContainer, { transform: [{ translateX: translationX }]}]}>
              <Animated.View style={[styles.cardContainer, styles.cardFront, frontAnimatedStyle, { backgroundColor: card.cardBackgroundColor }]}>
                {card.gameName.map((text, textIndex) => (
                  <Text style={[styles.cardText, { color: textIndex === lastWordIndex ? lastWordColor : '#fff' }]} key={textIndex}>{text}</Text>
                ))}
                <View style={styles.cardIconContainer}>
                  <Image style={styles.cardIcon} source={renderGameIcon(card.gameIcon)} />
                </View>

                <Link href={card.gamePath} asChild style={[styles.cardButtonContainer, { backgroundColor: card.cardButtonColor }]}>
                  <TouchableOpacity>
                    <Text style={styles.cardButtonText}>
                      {props.currentLang === 'pl' ? 'Rozpocznij grę' : 'Start game'}
                    </Text>
                  </TouchableOpacity>
                </Link>

                <TouchableOpacity onPress={props.flipped || isAnimating ? null : rotateCard} style={[styles.cardButtonContainer, { backgroundColor: card.cardButtonColor }]}>
                  <Text style={styles.cardButtonText}>
                    {props.currentLang === 'pl' ? 'Zasady gry' : 'Game rules'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View style={[ styles.cardContainer, styles.cardBack, backAnimatedStyle, { zIndex: props.flipped ? 1 : -1, backgroundColor: card.cardBackgroundColor },]}>
                <Text style={[styles.rulesHeader, { color: lastWordColor }]}>
                  {props.currentLang === 'pl' ? 'Zasady gry' : 'Game rules'}
                </Text>
                <Text style={[styles.cardGameRulesText, {  }]}>{card.gameRules}</Text>

                <TouchableOpacity onPress={props.flipped || isAnimating ? rotateCard : null} style={[styles.cardButtonContainer, { backgroundColor: card.cardButtonColor }]}>
                  <Text style={styles.cardButtonText}>
                    {props.currentLang === 'pl' ? 'Powrót do gry' : 'Back to game'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          );
        });
      })}
    </>
  );
}

export default MainCards;
