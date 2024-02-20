import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Nav from './components/nav'; // Import Nav component
import PlayersSelection from './components/playersSelection'; // Import PlayersSelection component'
import { readLanguage } from './scripts/language'; // Import language functions
import LoadingScreen from './loadingScreen'; // Import loading screen component
import { savePlayers, readPlayers } from './scripts/players'; // Import function savePlayers to saving players in local storage

function sevenSecondsGameAddPlayers() {
    // Set current lang default is english
    const [currentLang, setCurrentLang] = useState("en");
    // State for tracking loading component
    const [componentLoaded, setComponentLoaded] = useState(false);
    // State for tracking loading nav component
    const [navLoaded, setNavLoaded] = useState(false);
    const [playersLoaded, setPlayersLoaded] = useState(false);
    const [players, setPlayers] = useState([]);

    // Fetching saved language and players
    useEffect(() => {
        const fetchData = async () => {
            const lang = await readLanguage();
            setCurrentLang(lang);

            try {
                const players = await readPlayers();
                setPlayers(players);
                // Setting that categories are loaded
                setPlayersLoaded(true);
            } catch (error) {
                console.error('Error while reading players:', error);
            }
            
            // Set component and Nav component loaded state
            setTimeout(() => setComponentLoaded(true), 50)
            setTimeout(() => setNavLoaded(true), 50)
        };

        fetchData();   
    }, []);

    // Saving selected players to local storage after change
    useEffect(() => {
        const arePlayersValid = Array.isArray(players);
    
        if (arePlayersValid) {
            savePlayers(players);
        }
    }, [players]);

    // Display loading screen if component or fonts are not loaded
    if (!componentLoaded || !navLoaded || !playersLoaded) {
        return <LoadingScreen/>;
    }

    return (
        <View>
            <Nav currentLang={currentLang} main={false} contact={false} />

            <PlayersSelection players={players} setPlayers={setPlayers} currentLang={currentLang} setPlayersLoaded={setPlayersLoaded} game={"sevenSeconds"} />
        </View>
    )

}

export default sevenSecondsGameAddPlayers