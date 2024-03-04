import React, { useState, useEffect } from 'react';
import Nav from './components/nav'; // Import Nav component
import PlayersSelection from './components/playersSelection'; // Import PlayersSelection component'
import { readLanguage } from './scripts/language'; // Import language functions
import LoadingScreen from './loadingScreen'; // Import loading screen component
import { savePlayers, readPlayers } from './scripts/players'; // Import function savePlayers to saving players in local storage
import { ScrollView } from 'react-native';;

function sevenSecondsGameAddPlayers() {
    // Set current language (default is english)
    const [currentLang, setCurrentLang] = useState("en");
    // State for tracking loading component
    const [componentLoaded, setComponentLoaded] = useState(false);
    // State for tracking loading players
    const [playersLoaded, setPlayersLoaded] = useState(false);
    // Array of introduced players
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
            
            setTimeout(() => setComponentLoaded(true), 50)
        };

        fetchData();   
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

    return (
        <ScrollView>
            <Nav currentLang={currentLang} main={false} contact={false} />

            <PlayersSelection players={players} setPlayers={setPlayers} currentLang={currentLang} setPlayersLoaded={setPlayersLoaded} game={"sevenSeconds"} />
        </ScrollView>
    )

}

export default sevenSecondsGameAddPlayers