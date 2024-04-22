import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Animated, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts } from "expo-font"; 
import { readLanguage } from './scripts/language'; // Import function savePlayers to saving players in local storage
import Nav from './components/nav'; // Import Nav component
import { readPlayers } from './scripts/players'; // Import function savePlayers to saving players in local storage
import { loadTaskFromDatabase } from './scripts/truthOrDare/taskFunctions' // Import fetching tasks functions
import LoadingScreen from './loadingScreen'; // Import loading screen
import DatabaseErrorScreen from './databaseError'; // Import database error screen
import useNetInfo from './scripts/checkConnection'
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { readAdCounter, saveAdCounter } from './scripts/adCounter' // Import function saveCounter and readCounter to saving counter value and reading counter value in local storage
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

function TruthOrDare() {
    // Set variable with window width using useWindowDimensions hook
    const { width: windowWidth} = useWindowDimensions();

    const styles = StyleSheet.create({
        mainContainer: {
            backgroundColor: '#131313',
            alignItems: 'center',
            minHeight: 2 * windowWidth
        },
        cardsContainer: {
            flexDirection: 'row',
        },
        cardContainer: {
            borderRadius: .075 * windowWidth,
            width: '100%',
            borderColor: '#fff',
            borderWidth: .006 * windowWidth,
            height: 0.9 * windowWidth,
            borderRadius: .09 * windowWidth,
        },
        currentPlayerContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 0.075 * windowWidth,
            width: '100%',
            justifyContent: 'center'
        },
        currentPlayer: {
            fontFamily: 'LuckiestGuy',
            color: '#FFF',
            fontSize: 0.075 * windowWidth
        },
        card: {
            position: 'relative',
            width: 'auto',
            width: .45 * windowWidth
        },
        truthCard: {
            backgroundColor: '#4A8A22',
        },
        dareCard: {
            backgroundColor: '#810C0C',
        },
        truthHeader: {
            fontFamily: 'LuckiestGuy',
            color: '#FFF',
            textAlign: 'center',
            fontSize: 0.075 * windowWidth, 
            marginTop: 0.08 * windowWidth
        },
        cardsContainer: {
            flexDirection: 'row',
        },
        cardFront: {
            width: '100%',
            alignItems: 'center',
            backfaceVisibility: 'hidden',
        },
        cardBack: {
            width: '100%',
            alignItems: 'center',
            position: 'absolute',
            backfaceVisibility: 'hidden',
            height: 0.9 * windowWidth, 
            paddingTop: .04 * windowWidth,
            paddingHorizontal: .035 * windowWidth,
            paddingTop: .15 * windowWidth, 
        }, 
        buttonContainer: {
            backgroundColor: '#6C1EC5',
            width: '80%',
            paddingVertical: .02 * windowWidth,
            borderRadius: .048 * windowWidth,
            textAlign: 'center',
            position: 'relative',
            top: -(.175 * windowWidth),
        },
        buttonText: {
          textAlign: 'center',
          fontSize: .072 * windowWidth,
          fontFamily: 'LuckiestGuy',
          color: '#fff',
        },
        cardBackText: {
            fontFamily: 'LuckiestGuy',
            color: '#FFF',
            textAlign: 'center',
            fontSize: .045 * windowWidth
        }
    });

    // Set current language (default is english)
    const [currentLang, setCurrentLang] = useState('en');
    // State for storing drawn player
    const [drawnPlayer, setDrawnPlayer] = useState('');
    // Array of introduced players
    const [players, setPlayers] = useState([]);
    // State for tracking loading players
    const [playersLoaded, setPlayersLoaded] = useState(false);
    // State for currently selected card (truth/dare)
    const [selectedCard, setSelectedCard] = useState('');
    // State for tracking that card is currently animating
    const [isAnimating, setIsAnimating] = useState(false);
    // State for tracking whether the card is flipped default isn't flipped
    const [flipped, setFlipped] = useState(false);
    // State for storing truth card visibility
    const [truthCardVisibility, setTruthCardVisibility] = useState(true);
    // State for storing dare card visibility
    const [dareCardVisibility, setDareCardVisibility] = useState(true);
    // State to check if task is loaded
    const [loadedTask, setLoadedTask] = useState(false);
    // State for storing drawn task
    const [fetchedTask, setFetchedTask] = useState('');
    // State for tracking database errors
    const [databaseErrorStatus, setDatabaseErrorStatus] = useState(false);
      // State for tracking loading component
    const [componentLoaded, setComponentLoaded] = useState(false);
    // State to tracking when ad should be displayed
    const [adCounter, setAdCounter] = useState(1);
    const [counterLoaded, setCounterLoaded] = useState(false);
    // State to tracking that ad is loaded
    const [isAdLoaded, setIsAdLoaded] = useState(false);
    // Array with players who can't be currently drawn
    const [safePlayers, setSafePlayers] = useState([]);
    // State for tracking round number
    const [currentRound, setCurrentRound] = useState(1);
    // State for tracking when player should be removed from array
    const [safePlayersStatus, setSafePlayersStatus] = useState(false);

    // Load fonts 
    const [fontsLoaded] = useFonts({
        'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
    });

    const netInfo = useNetInfo();

    // X position for the "Truth" card
    const [truthTransformX] = useState(new Animated.Value(.06 * windowWidth));
    // X position for the "Dare" card
    const [dareTransformX] = useState(new Animated.Value(-(0.06 * windowWidth)));
    // Rotation for the "Truth" card
    const [truthRotate] = useState(new Animated.Value(1));
    // Rotation for the "Dare" card
    const [dareRotate] = useState(new Animated.Value(1));
    // Scale X for the "Truth" card
    const [truthScaleX] = useState(new Animated.Value(1));
    // Scale X for the "Dare" card
    const [dareScaleX] = useState(new Animated.Value(1));
    // Scale Y for the "Truth" card
    const [truthScaleY] = useState(new Animated.Value(1));
    // Scale Y for the "Dare" card
    const [dareScaleY] = useState(new Animated.Value(1));
    // State to tracking when ad should be displayed
    
    // State for rotation animation
    const rotateValue = useRef(new Animated.Value(0)).current;

    // Function to rotate the card
    const rotateCard = () => {
        if (isAnimating) return;
    
        setIsAnimating(true);
        const toValue = flipped ? 360 : 180;
    
        Animated.timing(rotateValue, {
            toValue,
            duration: 500,
            useNativeDriver: false,
        }).start(() => {
            setFlipped((prevFlipped) => !prevFlipped);
            setIsAnimating(false);
        });
    };

    // Function to fetch data when the component mounts
    useEffect(() => {
        let componentTimeout
        
        const fetchData = async () => {
            const lang = await readLanguage();
            setCurrentLang(lang);

            const counter = await readAdCounter();
            setAdCounter(counter);
            setCounterLoaded(true);
  
            // Fetching saved players
            const players = await readPlayers();
            setPlayers(players);
            // Setting that categories are loaded
            setPlayersLoaded(true);

            componentTimeout = setTimeout(() => setComponentLoaded(true), 50)
        };
    
        fetchData();
    
        return () => {
          clearTimeout(componentTimeout)
        }  
    }, []);

    // Effect to randomly select a player when the list of players changes
    useEffect(() => {
        if (players.length > 0) {
            randPlayer();
          }
    }, [players])

    let numberOfRounds;
    if (players.length >= 2 && players.length <= 4) {
        numberOfRounds = 2;
    } else if (players.length >= 5 && players.length <= 7) {
        numberOfRounds = 3;
    } else if (players.length >= 8 && players.length <= 10) {
        numberOfRounds = 4;
    } else if(players.length > 10) {
        numberOfRounds = 5;
    }

    // Function to randomly select a player from the list
    function randPlayer() {
        if(currentRound == numberOfRounds) {
            setSafePlayersStatus(true)
          }
    
          if(safePlayersStatus) {
            if(!players.length === 2) {
              safePlayers.shift()
            }
          }
    
          let randomPlayer;
          do {
            let playersArrayLength = players.length;
            randomPlayer = Math.floor(Math.random() * playersArrayLength);
    
            
          } while(safePlayers.includes(players[randomPlayer]))
    
          if(players.length === 2) {
            setSafePlayers([players[randomPlayer]])
          } else if(players.length !== 1) {
            setSafePlayers([...safePlayers, players[randomPlayer]]);
          }
    
          setDrawnPlayer(players[randomPlayer]);
    }

    // Function to discard the "Truth" card
    async function discardTruthCard() {
        Animated.parallel([
            Animated.timing(
                truthTransformX,
                {
                    toValue: 1.5 * windowWidth,
                    duration: 700,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                dareTransformX,
                {
                    toValue: -(0.225 * windowWidth),
                    duration: 700,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                dareRotate,
                {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                dareScaleX,
                {
                    toValue: 1.7,
                    duration: 400,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                dareScaleY,
                {
                    toValue: 1.5,
                    duration: 400,
                    useNativeDriver: true
                }
            )
        ]).start(() => {
            setTruthCardVisibility(false);
        });
    }
    
    // Function to discard the "Dare" card
    async function discardDareCard() {
        Animated.parallel([
            Animated.timing(
                dareTransformX,
                {
                    toValue: -(1.5 * windowWidth),
                    duration: 700,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                truthTransformX,
                {
                    toValue: 0.225 * windowWidth,
                    duration: 700,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                truthRotate,
                {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                truthScaleX,
                {
                    toValue: 1.7,
                    duration: 400,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                truthScaleY,
                {
                    toValue: 1.5,
                    duration: 400,
                    useNativeDriver: true
                }
            )
        ]).start(() => {
            setDareCardVisibility(false);
        });
    }

    async function returnCards() {
        randPlayer();

        if(currentRound==numberOfRounds) {
            setCurrentRound(1);
        } else {
            setCurrentRound(prev => prev+1);
        }

        if(currentRound==numberOfRounds) {
          setCurrentRound(1);
        }

        if (selectedCard === 'Dare') {
            setTruthCardVisibility(true);
            Animated.parallel([
                Animated.timing(
                    truthTransformX,
                    {
                        toValue: 0.06 * windowWidth,
                        duration: 700,
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    dareTransformX,
                    {
                        toValue: -(0.06 * windowWidth),
                        duration: 700,
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    dareRotate,
                    {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    dareScaleX,
                    {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    dareScaleY,
                    {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true
                    }
                )
            ]).start();
        } else if (selectedCard === 'Truth') {
            setDareCardVisibility(true);
            Animated.parallel([
                Animated.timing(
                    dareTransformX,
                    {
                        toValue: -(0.06 * windowWidth),
                        duration: 700,
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    truthTransformX,
                    {
                        toValue: 0.06 * windowWidth,
                        duration: 700,
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    truthRotate,
                    {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    truthScaleX,
                    {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true
                    }
                ),
                Animated.timing(
                    truthScaleY,
                    {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true
                    }
                )
            ]).start();
        }
        setSelectedCard('');
        rotateCard();
        setLoadedTask(false)
    }

    useEffect(() => {
        if(loadedTask)
        {
            rotateCard();
        }
    }, [loadedTask])

    const rotateTruthCard = truthRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-13deg'],
    });

    const rotateDareCard = dareRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '13deg'],
    });

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
    
    // Function to select a category (Truth or Dare)
    async function selectCard(category) {
        if(selectedCard === '' && !isAnimating) {
            setSelectedCard(category);
            category==="Truth" ? discardDareCard() : discardTruthCard();
        }
    }

    // Effect to load task from database when the selected card changes
    useEffect(() => {
        loadTaskFromDatabase(selectedCard, currentLang, setFetchedTask, setLoadedTask, setDatabaseErrorStatus);
    }, [selectedCard])

   // Clear cache
    async function clearCache() {
        await FileSystem.deleteAsync(FileSystem.cacheDirectory, { idempotent: true });
    }

    useEffect(() => {
    const handleAdLoaded = () => {
        setIsAdLoaded(true);
    };

    const handleAdClosed = () => {
        setIsAdLoaded(false);
        setAdCounter(1)
        clearCache();
    };

    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, handleAdLoaded);
    const unsubscribeAdClosed = interstitial.addAdEventListener(AdEventType.CLOSED, handleAdClosed);

    interstitial.load();

    return () => {
        unsubscribeLoaded();
        unsubscribeAdClosed();

        interstitial.removeAllListeners();
    };
    }, []);

    useEffect(() => {
    if(!isAdLoaded)
    {
        interstitial.load();
        setIsAdLoaded(true);
    }

        if (adCounter % 10 === 0) {
        interstitial.show();
        }

    }, [adCounter]);

    useEffect(() => {
        if(counterLoaded)
        {
            saveAdCounter(adCounter);
        }
    }, [adCounter]);

    // Update ad counter value after question changed
    useEffect(() => {
        if(counterLoaded) {
            setAdCounter((prev) => prev+1)
        }
    }, [selectedCard])

    // Display loading screen if component or fonts are not loaded
    if (!fontsLoaded || !componentLoaded || !playersLoaded) {
        return <LoadingScreen/>;
    }

    // Display database error screen if there is error in fetching from database
    if (databaseErrorStatus) {
        return <DatabaseErrorScreen />;
    }

    // Display internet error screen if there is no internet connection
    if (!netInfo) {
        return <ConnectionErrorScreen/>;
    }

    return (
        <View>
            <StatusBar backgroundColor='#000' style="light" />
            <Nav currentLang={currentLang} main={false}/>
            <ScrollView contentContainerStyle={[styles.mainContainer]}>
                <View style={[styles.currentPlayerContainer, { display: selectedCard !== '' ? 'none' : 'block'}]}>
                    {currentLang === 'pl' ? (
                        <>
                            <Text style={styles.currentPlayer}>Wybiera  </Text>
                            <Text style={[styles.currentPlayer, { color: '#EB1010' }]}>{drawnPlayer}</Text>
                        </>
                    ) : (
                        <>
                            <Text style={[styles.currentPlayer, { color: '#EB1010' }]}>{drawnPlayer}</Text>
                            <Text style={styles.currentPlayer}>  is choosing</Text>
                        </>
                    )}

                </View>
                
                <View style={[styles.cardsContainer, {marginTop: 0.25 * windowWidth, paddingTop: selectedCard !== '' ? .08 * windowWidth : 0}]}>
                    <Pressable style={{zIndex: 1}} onPress={() => selectCard("Truth")}>
                        <Animated.View style={[styles.cardsContainer, styles.card,  { opacity: !truthCardVisibility ? 0 : 1, transform: [{ rotate: rotateTruthCard}, {translateX: truthTransformX}, { scaleX: truthScaleX }, { scaleY: truthScaleY } ]}]}>
                            <Animated.View style={[styles.cardContainer, styles.cardFront,  styles.truthCard , frontAnimatedStyle ]}>
                                <Text style={styles.truthHeader}>{currentLang === 'pl' ? 'Prawda' : 'Truth'}</Text>
                            </Animated.View>
                            <Animated.View style={[styles.cardContainer,styles.cardBack, backAnimatedStyle,  styles.truthCard ]}>
                                <Text style={styles.cardBackText}>{fetchedTask}</Text>
                            </Animated.View>
                        </Animated.View>
                    </Pressable>

                    <Pressable onPress={() => selectCard("Dare")}>
                        <Animated.View style={[ styles.cardsContainer, styles.card,  { opacity: !dareCardVisibility ? 0 : 1,  transform: [{ rotate: rotateDareCard}, {translateX: dareTransformX}, { scaleX: dareScaleX }, { scaleY: dareScaleY } ]}]}>
                            
                            <Animated.View style={[styles.cardContainer, styles.cardFront,  styles.dareCard , frontAnimatedStyle, {height: 0.9 * windowWidth}]}>
                                <Text style={styles.truthHeader}>{currentLang === 'pl' ? 'Wyzwanie' : 'Dare'}</Text>
                            </Animated.View>

                            <Animated.View style={[styles.cardContainer, styles.cardBack, backAnimatedStyle, styles.dareCard ]}>
                                <Text style={styles.cardBackText}>{fetchedTask}</Text>
                            </Animated.View>

                        </Animated.View>
                    </Pressable>
                    
                </View>
                {loadedTask && 
                    <TouchableOpacity disabled={isAnimating} onPress={() => returnCards()} style={[styles.buttonContainer, { marginTop: .55 * windowWidth, backgroundColor: selectedCard === 'Dare' ? '#F0000E' : '#6ACC2C' }]}>
                        <Text style={styles.buttonText}>{currentLang === 'pl' ? 'Wybierz następną kartę' : 'Select next card'}</Text>
                    </TouchableOpacity>
                }
            </ScrollView>
        </View>
    );
}

export default TruthOrDare;
