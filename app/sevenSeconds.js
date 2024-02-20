import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Nav from './components/nav'; // Import Nav component

function sevenSeconds() {
    // Set current lang default is english
    const [currentLang, setCurrentLang] = useState("en");

    // Fetching saved language
    useEffect(() => {
        const fetchData = async () => {
        const lang = await readLanguage();
        setCurrentLang(lang);

        // Set component and Nav component loaded state
            setTimeout(() => setComponentLoaded(true), 50)
            setTimeout(() => setNavLoaded(true), 50)
        };

        fetchData();   
    }, []);

    return (
        <View>
            <Nav currentLang={currentLang} main={false} contact={false} />

        </View>
    )

}

export default sevenSeconds