import React, { useState, useEffect, useRef } from 'react';
import CardsData from './mainCardsData.json';
import { View, StyleSheet, Text, Image, TouchableOpacity, Animated, Easing, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';

function MainCards(props) {
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

    // Card rotate animtaion details
    Animated.timing(rotateValue, {
      toValue,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      props.setFlipped((prevFlipped) => !prevFlipped);
      props.setResetFlipped(false);
      setIsAnimating(false);
    });
  };

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
      toValue: -props.currentCard * 0.945 * props.windowWidth,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
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
            <Animated.View key={index} style={[ styles.cardsContainer, { width: .685 * props.windowWidth, transform: [{ translateX: translationX }], marginRight: .26 * props.windowWidth } ]}>
              <Animated.View style={[ styles.cardContainer, styles.cardFront, frontAnimatedStyle, { backgroundColor: card.cardBackgroundColor },]}>
                {card.gameName.map((text, textIndex) => (
                  <Text style={[ styles.cardText, { fontSize: .11 * props.windowWidth, lineHeight: .11 * props.windowWidth, color: textIndex === lastWordIndex ? lastWordColor : '#fff' },]} key={textIndex}>
                    {text}
                  </Text>
                ))}
                <View style={styles.cardIconContainer}>
                  <Image source={renderGameIcon(card.gameIcon)} />
                </View>

                <Link href={card.gamePath} asChild  style={[styles.cardButtonContainer, { backgroundColor: card.cardButtonColor }]}>
                  <TouchableOpacity>
                    <Text style={[styles.cardButtonText, { fontSize: .062 * props.windowWidth }]}>
                      {props.currentLang === 'pl' ? 'Rozpocznij grę' : 'Start game'}
                    </Text>
                  </TouchableOpacity>
                </Link>

                <TouchableOpacity onPress={props.flipped || isAnimating ? null : rotateCard} style={[styles.cardButtonContainer, { backgroundColor: card.cardButtonColor }]}>
                  <Text style={[styles.cardButtonText, { fontSize: .062 * props.windowWidth }]}>
                    {props.currentLang === 'pl' ? 'Zasady gry' : 'Game rules'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View style={[ styles.cardContainer, styles.cardBack, backAnimatedStyle, { zIndex: props.flipped ? 1 : -1, backgroundColor: card.cardBackgroundColor },]}>
                <Text style={[styles.rulesHeader, { color: lastWordColor, fontSize: .1 * props.windowWidth }]}>
                  {props.currentLang === 'pl' ? 'Zasady gry' : 'Game rules'}
                </Text>
                <Text style={[styles.cardGameRulesText, { fontSize: .055 * props.windowWidth, lineHeight: .075* props.windowWidth }]}>{card.gameRules}</Text>

                <TouchableOpacity onPress={props.flipped || isAnimating ? rotateCard : null} style={[styles.cardButtonContainer, { backgroundColor: card.cardButtonColor }]}>
                  <Text style={[styles.cardButtonText, { fontSize: .062 * props.windowWidth }]}>
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

const styles = StyleSheet.create({
  cardsContainer: {
    flexDirection: 'row',
  },
  cardContainer: {
    borderRadius: 30,
    width: '100%',
    borderColor: '#fff',
    borderWidth: 2,
  },
  cardFront: {
    width: '100%',
    marginRight: 10,
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    paddingTop: 40
  },
  cardBack: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    backfaceVisibility: 'hidden',
    paddingTop: 20
  },
  rulesHeader: {
    fontFamily: 'LuckiestGuy',
  },
  cardText: {
    fontFamily: 'LuckiestGuy',
  },
  cardGameRulesText: {
    width: '90%',
    fontFamily: 'LuckiestGuy',
    marginBottom: 40,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    marginTop: 15,
  },
  cardIconContainer: {
    backgroundColor: '#0F0F0F',
    padding: 23,
    borderColor: '#262323',
    borderWidth: 4,
    borderRadius: 100,
    marginTop: 20,
    marginBottom: 30,
  },
  cardButtonContainer: {
    width: '85%',
    marginBottom: 25,
    paddingVertical: 7,
    borderRadius: 16,
    textAlign: 'center',
  },
  cardButtonText: {
    textAlign: 'center',
    fontFamily: 'LuckiestGuy',
    color: '#fff',
  },
});

export default MainCards;
