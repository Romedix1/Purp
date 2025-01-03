import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions, TouchableOpacity, Animated, PanResponder } from 'react-native';
import Nav from './components/nav'; // Import Nav component
import { readLanguage } from './scripts/language'; // Import language functions
import { getFirstTask, getSecondTask } from './scripts/sevenSeconds/tasksFunctions' // Import fetching tasks functions
import LoadingScreen from './loadingScreen'; // Import loading screen component
import DatabaseErrorScreen from './databaseError'; // Import database error screen
import { useFonts } from 'expo-font';
import { readPlayers } from './scripts/players'; // Import function savePlayers to saving players in local storage
import useNetInfo from './scripts/checkConnection'
// import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { readAdCounter, saveAdCounter } from './scripts/adCounter' // Import function saveCounter and readCounter to saving counter value and reading counter value in local storage
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';
// import { AD_UNIT_ID } from '@env';

// const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : AD_UNIT_ID;

// const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
//   requestNonPersonalizedAdsOnly: true,
// });

function sevenSeconds() {
    // Set variable with window width using useWindowDimensions hook
    const { width: windowWidth} = useWindowDimensions();

    // Set current language (default is english)
    const [currentLang, setCurrentLang] = useState("en");
    // State for tracking loading component
    const [componentLoaded, setComponentLoaded] = useState(false);
    // Timer value (7 seconds)
    const [timerValue, setTimerValue] = useState(70); 
    // Width of progress bar
    const [progressWidth, setProgressWidth] = useState(0); 
    // State for tracking timer status
    const [startedTimer, setStartedTimer] = useState(false); 
    // State for tracking which question should be displayed
    const [secondTaskStatus, setSecondTaskStatus] = useState(false);
    // State for storing first task
    const [firstTask, setFirstTask] = useState('');
    // State for storing second task
    const [secondTask, setSecondTask] = useState('');
    // State for tracking which direction the card should be discarded
    const [direction, setDirection] = useState(false);
    // State for tracking loading tasks
    const [tasksLoaded, setTasksLoaded] = useState(false);
    // State to check if the second task is loaded
    const [loadingSecondTask, setLoadingSecondTask] = useState(false);
    // State for tracking tasks on load (finger handling)
    const [taskFetched, setTaskFetched] = useState(false);
    // Array of introduced players
    const [players, setPlayers] = useState([]);
    // State for tracking loading players
    const [playersLoaded, setPlayersLoaded] = useState(false);
    // State for storing the first drawn player
    const [drawnPlayer, setDrawnPlayer] = useState('');
    // State for storing the second drawn player
    const [secondDrawnPlayer, setSecondDrawnPlayer] = useState('');
    // State for tracking database errors
    const [databaseErrorStatus, setDatabaseErrorStatus] = useState(false);
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
    const [isTablet, setIsTablet] = useState(false);
    // Array with recently used questions
    const [unavailableQuestions, setUnavailableQuestions] = useState([]);

    // Load fonts 
    const [fontsLoaded] = useFonts({
        LuckiestGuy: require('../assets/fonts/LuckiestGuy-Regular.ttf'),
    });

      const styles = StyleSheet.create({
        mainContainer: {
          backgroundColor: '#131313',
          alignItems: 'center',
        },
        timerContainer: {
            borderWidth: .006 * windowWidth,
            borderColor: '#FFF',
            borderRadius: .048 * windowWidth,
            position: 'relative',
            overflow: 'hidden',
            width: 0.78 * windowWidth, 
            marginTop: isTablet ? 0.05 * windowWidth : .06 * windowWidth,
        },
        timerFill: {
            backgroundColor: '#0A3C88',
            borderRadius: .048 * windowWidth,
            paddingVertical: isTablet ? 0.017 * windowWidth :  .023 * windowWidth,
        },
        timerValue: {
            fontFamily: 'LuckiestGuy',
            color: '#FFF',
            fontSize: isTablet ? 0.05 * windowWidth : .065 * windowWidth, 
            marginTop: isTablet ? 0.025 * windowWidth : .035 * windowWidth
        },
        buttonContainer: {
          backgroundColor: '#0536E4',
          width: isTablet ? '65%' : '80%',
          paddingVertical: .012 * windowWidth,
          borderRadius: .035 * windowWidth,
          textAlign: 'center',
          position: 'relative',
        },
        buttonText: {
          textAlign: 'center',
          fontFamily: 'LuckiestGuy',
          color: '#fff',
          fontSize: isTablet ? .04 * windowWidth : .065 * windowWidth
        },
        questionContainer: {
          backgroundColor: '#0A3C88', 
          borderRadius: .09 * windowWidth,
          borderColor: '#FFF',
          width: isTablet ? .65 * windowWidth : .78 * windowWidth, 
          marginTop: isTablet ? .06 * windowWidth : .1 * windowWidth, 
          borderWidth: .009 * windowWidth,
          minHeight: isTablet ? .60 * windowWidth : 1.05 * windowWidth,
          paddingTop: isTablet ? .05 * windowWidth : .1 * windowWidth, 
          paddingHorizontal: .05 * windowWidth
        },
        questionText: {
          textAlign: 'center', 
          fontFamily: 'LuckiestGuy', 
          color: '#FFF',
          fontSize: isTablet ? .05 * windowWidth : .08 * windowWidth,
          paddingVertical: isTablet ? .04 * windowWidth : 0.07 * windowWidth, 
        },
    });

    const netInfo = useNetInfo();

    // State for rotation animation
    const rotateValue = useState(new Animated.Value(0))[0];
    // State for slide animation
    const slideValue = useState(new Animated.Value(0))[0];

    // Fetching saved language and players
    useEffect(() => {
        const fetchData = async () => {
          // Fetching saved language
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
    
        setIsTablet(windowWidth>=600)

        fetchData();
    
        return () => {
          clearTimeout()
        }  
    }, []);

    // Randomly select a player
    useEffect(() => {
        if (players.length > 0) {
          randPlayer();
          randSecondPlayer()
        }
      }, [playersLoaded]);

    // Timer logic
    useEffect(() => {
        let timerInterval;

        if (startedTimer) {
            timerInterval = setInterval(() => {
                setTimerValue(prevValue => {
                    if (prevValue === 0) {
                        clearInterval(timerInterval);

                        return 0;
                    } else {
                        return prevValue - 1;
                    }
                });
            }, 100);
        }

        return () => {
          clearInterval(timerInterval);
        }
    }, [startedTimer]);

    // Handle timer start/stop
    const handleTimer = () => {
        setStartedTimer(prev => !prev);
    };

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

    // Function to select a random player
    function randPlayer() {
        if(currentRound == numberOfRounds) {
          setSafePlayersStatus(true)
        }
        
        if(safePlayersStatus) {
          if(players.length !== 2) {
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

    // Function to select a second random player
    function randSecondPlayer() {
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

      setSecondDrawnPlayer(players[randomPlayer]);
    }

    // Fetch tasks when language changes (on load)
    useEffect(() => {
      let firstTaskTimeout;
      let secondTaskTimeout;

        async function fetchTasks() {
          if (!firstTask) {
              getFirstTask(setFirstTask, currentLang, setDatabaseErrorStatus, unavailableQuestions, setUnavailableQuestions).then(() => {
                firstTaskTimeout = setTimeout(() => setTasksLoaded(true), 50)
              });
            }
          if (!secondTask) {
            getSecondTask(setSecondTask, currentLang, setDatabaseErrorStatus, unavailableQuestions, setUnavailableQuestions).then(() => {
              secondTaskTimeout = setTimeout(() => setTasksLoaded(true), 50)
            });
          }
        }

        fetchTasks();

        return () => {
          clearTimeout(firstTaskTimeout)
          clearTimeout(secondTaskTimeout)
        }
    }, [currentLang]);
    
    useEffect(() => {
        // Calculate width percentage based on current timer value and maximum value
        const widthPercentage = (timerValue / 7) * 10; 
        // Convert width percentage to actual width based on window width
        setProgressWidth((widthPercentage / 130) * windowWidth); 
    }, [timerValue, windowWidth]);

    // Clear cache
    async function clearCache() {
      await FileSystem.deleteAsync(FileSystem.cacheDirectory, { idempotent: true });
    }

    // useEffect(() => {
    // const handleAdLoaded = () => {
    //   setIsAdLoaded(true);
    // };

    // const handleAdClosed = () => {
    //   setIsAdLoaded(false);
    //   setAdCounter(1)
    //   clearCache();
    // };

    // const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, handleAdLoaded);
    // const unsubscribeAdClosed = interstitial.addAdEventListener(AdEventType.CLOSED, handleAdClosed);

    // interstitial.load();

    // return () => {
    //   unsubscribeLoaded();
    //   unsubscribeAdClosed();

    //   interstitial.removeAllListeners();
    // };
    // }, []);

    // useEffect(() => {
    // if(!isAdLoaded)
    // {
    //   interstitial.load();
    //   setIsAdLoaded(true);
    // }

    //   if (adCounter % 10 === 0) {
    //     interstitial.show();
    //   }

    // }, [adCounter]);

    useEffect(() => {
      if(counterLoaded)
      {
        saveAdCounter(adCounter);
      }
    }, [adCounter]);

    async function getTasks() {
        let timerValueTimeout;

        if(currentRound==numberOfRounds) {
          setCurrentRound(1);
        } else {
          setCurrentRound(prev => prev+1);
        }

        if(startedTimer)
        {
          setStartedTimer(false)
        }

        timerValueTimeout = setTimeout(() => setTimerValue(70), 10);

        setLoadingSecondTask(true);
        Animated.parallel([
          Animated.timing(rotateValue, {
            toValue: direction ? 1 : -1,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(slideValue, {
            toValue: 1,
            duration: direction ? 1 : -1,
            useNativeDriver: true,
          }),
        ]).start(() => {
          rotateValue.setValue(0);
          slideValue.setValue(0);

          // Changing state for the question which should be displayed
          setSecondTaskStatus(prev => !prev);

          // If the next question status is true, then get and draw the next question
          if (secondTaskStatus) {
            getSecondTask(setSecondTask, currentLang, setDatabaseErrorStatus, unavailableQuestions, setUnavailableQuestions).then(() => {
                setLoadingSecondTask(false);
                randSecondPlayer();
            });
          // If the next question status is false, then get and draw the next question
          } else {
            getFirstTask(setFirstTask, currentLang, setDatabaseErrorStatus, unavailableQuestions, setUnavailableQuestions).then(() => {
                setLoadingSecondTask(false);
                randPlayer();
            });
          }
          if(counterLoaded) {
            setAdCounter((prev) => prev+1)
          }
        });

        return () => {
          clearTimeout(timerValueTimeout)
        }
      }

      const rotateCard = rotateValue.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-15deg', '0deg', '15deg'],
      });
    
      const slideCard = rotateValue.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [ -(windowWidth * 1.5), 0, windowWidth * 1.5],
      });

      let taskTimeout;

      const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
          const distance = gestureState.dx;
          const threshold = 50;
      
          // Setting the direction in which the card should be discarded
          if (distance > 0) {
            setDirection(true);
          } else {
            setDirection(false);
          }
      
          // Blocking swipe until the next question is loaded
          if (Math.abs(distance) > threshold) {
            if (!taskFetched && !loadingSecondTask) {
              setTaskFetched(true);
              
              taskTimeout = setTimeout(() => {
                getTasks();
              }, 10);
            }
          }
        },
        onPanResponderRelease: () => {
          clearTimeout(taskTimeout);
          if (loadingSecondTask) {
            setTaskFetched(false);
          }
        },
        onPanResponderTerminate: () => {
          clearTimeout(taskTimeout);
          if (loadingSecondTask) {
            setTaskFetched(false);
          }
        },
      });

    if (!fontsLoaded || !componentLoaded || !tasksLoaded) {
      return <LoadingScreen/>;
    }
    
    // Display database error screen if there is error in fetching from database
    if (databaseErrorStatus) {
      return <DatabaseErrorScreen />;
    }

    // Display internet connection error screen if there is no internet connection
    if (!netInfo) {
      return <ConnectionErrorScreen />;
    }

    return (
        <View style={{backgroundColor: '#131313'}}>
            <StatusBar backgroundColor='#000' style="light" />
            <Nav isTablet={isTablet} currentLang={currentLang} main={false} contact={false} />

            <ScrollView contentContainerStyle={styles.mainContainer}>
                <View style={[styles.timerContainer, { backgroundColor: timerValue === 0 ? "red" : 'transparent' }]}>
                    <View style={[styles.timerFill, { width: progressWidth }]}></View>
                </View>
                <Text style={styles.timerValue}>{timerValue === 0 ? (currentLang === "pl" ? "Koniec czasu" : "Time's up") : (timerValue / 10).toFixed(1)}</Text>
            
                <View>
                    <Animated.View {...panResponder.panHandlers} style={[styles.questionContainer, { transform: [{ rotate: !secondTaskStatus ? rotateCard : '0deg' }, { translateX: !secondTaskStatus ? slideCard : 0 }], zIndex: secondTaskStatus ? 1 : 2, position: 'relative' }]}>
                        <Text style={styles.questionText}>
                            <Text style={[styles.questionText, {  marginRight: 0.025 * windowWidth, color: '#00E5FA' }]}>{drawnPlayer}</Text><Text> </Text>
                            {firstTask}
                        </Text>
                    </Animated.View>
                    <Animated.View {...panResponder.panHandlers} style={[styles.questionContainer, { transform: [{ rotate: secondTaskStatus ? rotateCard : '0deg' }, { translateX: secondTaskStatus ? slideCard : 0 }], position: 'absolute',  zIndex: secondTaskStatus ? 2 : 1 }]}>
                        <Text style={styles.questionText}>
                        <Text style={[styles.questionText, { marginRight: 0.025 * windowWidth, color: '#00E5FA' }]}>{secondDrawnPlayer}</Text><Text> </Text>
                          {secondTask}</Text>
                    </Animated.View>
                    <View style={{ width: isTablet ? .65 * windowWidth : .78 * windowWidth, position: 'relative', top: isTablet ? -0.17 * windowWidth : -0.15 * windowWidth, zIndex: -2, backgroundColor: '#002256', borderRadius: .07 * windowWidth, borderColor: '#FFF', paddingBottom: 0.2 * windowWidth, borderWidth: isTablet ? .006 * windowWidth : .01 * windowWidth }}>
                    </View>
                    <View style={{ width: isTablet ? .65 * windowWidth : .78 * windowWidth, position: 'relative', top: isTablet ? -0.34 * windowWidth : -0.3 * windowWidth, zIndex: -3, backgroundColor: '#00112B', borderRadius: .07 * windowWidth, borderColor: '#FFF', paddingBottom: 0.2 * windowWidth, borderWidth: isTablet ? .005 * windowWidth : .008 * windowWidth }}>
                    </View>
                </View>

                <TouchableOpacity onPress={handleTimer} style={[styles.buttonContainer, { top: isTablet ? -0.27 * windowWidth : -0.24 * windowWidth }]}>
                    <Text style={styles.buttonText}>{startedTimer ? (currentLang === "pl" ? "Zatrzymaj odliczanie" : "Stop countdown") : (currentLang === "pl" ? "Rozpocznij odliczanie" : "Start countdown")}</Text>
                </TouchableOpacity>

                <TouchableOpacity disabled={loadingSecondTask} onPress={getTasks} style={[styles.buttonContainer, { marginBottom: 0.1 * windowWidth, top: isTablet ? -0.23 * windowWidth : -0.19 * windowWidth }]}>
                    <Text style={styles.buttonText}>{currentLang === "pl" ? "Nastepne zadanie" : "Next task"}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

export default sevenSeconds;
