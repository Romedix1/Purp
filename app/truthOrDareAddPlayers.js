import React, { useState, useEffect } from 'react';
import Nav from './components/nav'; // Import Nav component
import PlayersSelection from './components/playersSelection'; // Import PlayersSelection component'
import { readLanguage } from './scripts/language'; // Import language functions
import LoadingScreen from './loadingScreen'; // Import loading screen component
import { savePlayers, readPlayers } from './scripts/players'; // Import function savePlayers to saving players in local storage
import { ScrollView, useWindowDimensions } from 'react-native';
import useNetInfo from './scripts/checkConnection'
import { StatusBar } from 'expo-status-bar';

function truthOrDareAddPlayers() {
    const { width: windowWidth } = useWindowDimensions();

    // Set current language (default is english)
    const [currentLang, setCurrentLang] = useState("en");
    // State for tracking loading component
    const [componentLoaded, setComponentLoaded] = useState(false);
    // State for tracking loading players
    const [playersLoaded, setPlayersLoaded] = useState(false);
    // Array of introduced players
    const [players, setPlayers] = useState([]);
    const [isTablet, setIsTablet] = useState(false);

    const netInfo = useNetInfo();

    // Fetching saved language and players
    useEffect(() => {
        let componentTimeout;
        
        const fetchData = async () => {
            const lang = await readLanguage();
            setCurrentLang(lang);

            const players = await readPlayers();
            setPlayers(players);
            setPlayersLoaded(true);
            
            setIsTablet(windowWidth>=600)
            
            componentTimeout = setTimeout(() => setComponentLoaded(true), 50)
        };
    
        fetchData();
    
        return () => {
          clearTimeout(componentTimeout)
        }
      }, []);

    // Saving selected players to local storage after change
    useEffect(() => {
        const arePlayersValid = Array.isArray(players);
    
        if (arePlayersValid && playersLoaded) {
            savePlayers(players);
        }
    }, [players]);

    // Display loading screen if component or fonts are not loaded
    if (!componentLoaded || !playersLoaded) {
        return <LoadingScreen/>;
    }

    // Display internet connection error screen if there is no internet connection
    if (!netInfo) {
        return <ConnectionErrorScreen/>;
    }

    return (
        <ScrollView contentContainerStyle={{backgroundColor: '#131313'}}>
            <StatusBar backgroundColor='#000' style="light" />
            <Nav isTablet={isTablet} currentLang={currentLang} main={false} contact={false} />

            <PlayersSelection isTablet={isTablet} players={players} setPlayers={setPlayers} currentLang={currentLang} setPlayersLoaded={setPlayersLoaded} game={"truthOrDare"} />
        </ScrollView>
    )

}

export default truthOrDareAddPlayers