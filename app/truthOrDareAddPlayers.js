import React, { useState, useEffect } from 'react';
import Nav from './components/nav'; // Import Nav component
import PlayersSelection from './components/playersSelection'; // Import PlayersSelection component'
import { readLanguage } from './scripts/language'; // Import language functions
import LoadingScreen from './loadingScreen'; // Import loading screen component
import { savePlayers, readPlayers } from './scripts/players'; // Import function savePlayers to saving players in local storage
import { ScrollView } from 'react-native';
import useNetInfo from './scripts/checkConnection'

function sevenSecondsGameAddPlayers() {
    // Set current language (default is english)
    const [currentLang, setCurrentLang] = useState("en");
    // State for tracking loading component
    const [componentLoaded, setComponentLoaded] = useState(false);
    // State for tracking loading players
    const [playersLoaded, setPlayersLoaded] = useState(false);
    // Array of introduced players
    const [players, setPlayers] = useState([]);

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

    // Display internet error screen if there is no internet connection
    if (!netInfo) {
        return <ConnectionErrorScreen/>;
    }

    return (
        <ScrollView>
            <Nav currentLang={currentLang} main={false} contact={false} />

            <PlayersSelection players={players} setPlayers={setPlayers} currentLang={currentLang} setPlayersLoaded={setPlayersLoaded} game={"truthOrDare"} />
        </ScrollView>
    )

}

export default sevenSecondsGameAddPlayers