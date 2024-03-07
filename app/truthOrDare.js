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
            height: 0.9 * windowWidth
          },
        currentPlayerContainer: {
            flexDirection: 'row',
            marginTop: 0.075 * windowWidth,
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
            paddingTop: .04 * windowWidth
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
          fontSize: .078 * windowWidth,
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

    // Load fonts 
    const [fontsLoaded] = useFonts({
        'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
    });

    const netInfo = useNetInfo();
    // Fetching saved language
    useEffect(() => {
      const fetchData = async () => {
        const lang = await readLanguage();
        setCurrentLang(lang);
  
        setTimeout(() => setComponentLoaded(true), 50)
      };
  
      fetchData(); 
    }, []);

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
        const fetchData = async () => {
            const lang = await readLanguage();
            setCurrentLang(lang);

            const players = await readPlayers();
            setPlayers(players);
            setPlayersLoaded(true);

            setTimeout(() => setComponentLoaded(true), 50)
        };

        fetchData();
    }, []);

    // Effect to randomly select a player when the list of players changes
    useEffect(() => {
        randPlayer()
    }, [players])

    // Function to randomly select a player from the list
    function randPlayer() {
        let playersArrayLength = players.length;
        let randomPlayer = Math.floor(Math.random() * playersArrayLength);

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
    async function selectCategory(category) {
        if(selectedCard === '') {
            setSelectedCard(category);
            category==="Truth" ? discardDareCard() : discardTruthCard();
        }
    }

    // Effect to load task from database when the selected card changes
    useEffect(() => {
        loadTaskFromDatabase(selectedCard, currentLang, setFetchedTask, setLoadedTask, setDatabaseErrorStatus);
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
            <Nav currentLang={currentLang} main={false}/>
            <ScrollView contentContainerStyle={[styles.mainContainer]}>
                <View style={[styles.currentPlayerContainer, { display: selectedCard !== '' ? 'none' : 'block'}]}>
                    <Text style={styles.currentPlayer}>Wybiera  </Text>
                    <Text style={[styles.currentPlayer, { color: '#EB1010' }]}>{drawnPlayer}</Text>
                </View>
                
                <View style={[styles.cardsContainer, {marginTop: 0.25 * windowWidth, paddingTop: selectedCard !== '' ? .08 * windowWidth : 0}]}>
                    <Pressable style={{zIndex: 1}} onPress={() => selectCategory("Truth")}>
                        <Animated.View style={[styles.cardsContainer, styles.card,  { opacity: !truthCardVisibility ? 0 : 1, transform: [{ rotate: rotateTruthCard}, {translateX: truthTransformX}, { scaleX: truthScaleX }, { scaleY: truthScaleY } ]}]}>
                            <Animated.View style={[styles.cardContainer, styles.cardFront,  styles.truthCard , frontAnimatedStyle ]}>
                                <Text style={styles.truthHeader}>Prawda</Text>
                            </Animated.View>
                            <Animated.View style={[styles.cardContainer,styles.cardBack, backAnimatedStyle,  styles.truthCard ]}>
                                <Text style={styles.cardBackText}>{fetchedTask}</Text>
                            </Animated.View>
                        </Animated.View>
                    </Pressable>

                    <Pressable onPress={() => selectCategory("Dare")}>
                        <Animated.View style={[ styles.cardsContainer, styles.card,  { opacity: !dareCardVisibility ? 0 : 1,  transform: [{ rotate: rotateDareCard}, {translateX: dareTransformX}, { scaleX: dareScaleX }, { scaleY: dareScaleY } ]}]}>
                            
                            <Animated.View style={[styles.cardContainer, styles.cardFront,  styles.dareCard , frontAnimatedStyle, {height: 0.9 * windowWidth}]}>
                                <Text style={styles.truthHeader}>Wyzwanie</Text>
                            </Animated.View>

                            <Animated.View style={[styles.cardContainer, styles.cardBack, backAnimatedStyle, styles.dareCard ]}>
                                <Text style={styles.cardBackText}>{fetchedTask}</Text>
                            </Animated.View>

                        </Animated.View>
                    </Pressable>
                    
                </View>
                {loadedTask && 
                    <TouchableOpacity onPress={() => returnCards()} style={[styles.buttonContainer, { marginTop: .55 * windowWidth, backgroundColor: selectedCard === 'Dare' ? '#F0000E' : '#6ACC2C' }]}>
                        <Text style={styles.buttonText}>Wybierz następne</Text>
                    </TouchableOpacity>
                }
            </ScrollView>
        </View>
    );
}

export default TruthOrDare;
