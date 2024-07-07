import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, useWindowDimensions } from 'react-native';
import { useFonts } from "expo-font";
import { readLanguage } from './scripts/language'; // Import language functions
import { StatusBar } from 'expo-status-bar';

function databaseError(props) {
    // Set variable with window width and window height using useWindowDimensions hook
    const { width: windowWidth} = useWindowDimensions();
    
    // Set current language (default is english)
    const [currentLang, setCurrentLang] = useState("en");
    const [isTablet, setIsTablet] = useState(false);

    const styles = StyleSheet.create({
        databaseErrorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1E0041',
        },
        databaseErrorIcon: {
            resizeMode: 'contain',
            width: isTablet ? .3 * windowWidth : .6 * windowWidth,
            height: isTablet ? .3 * windowWidth : .6 * windowWidth,
        },
        databaseErrorHeader: {
            textAlign: 'center',
            fontFamily: 'LuckiestGuy',
            color: "#fff",
            fontSize: isTablet ? .06 * windowWidth : .068 * windowWidth,
            marginTop: .05 * windowWidth
        },
        databaseErrorText: {
            width: '95%',
            textAlign: 'center',
            fontFamily: 'LuckiestGuy',
            color: "#fff",
            fontSize: isTablet ? .04 * windowWidth : .045 * windowWidth, 
            marginTop: .04 * windowWidth
        }
    })

    // Load fonts 
    const [fontsLoaded] = useFonts({
        'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
    });

    // Fetching saved language
    useEffect(() => {
        const fetchData = async () => {
            const lang = await readLanguage();
            setCurrentLang(lang);

            setIsTablet(windowWidth>=600)
        };

        fetchData(); 
    }, []);

    return (
        <View style={styles.databaseErrorContainer}>
            <StatusBar backgroundColor='#1E0041' style="light" />
            <Image style={styles.databaseErrorIcon} source={require('../assets/icons/databaseErrorIcon.png')}/>
            <Text style={styles.databaseErrorHeader}>{currentLang === 'pl' ? 'Błąd połączenia z bazą danych' : 'Database connection error'}</Text>
            <Text style={styles.databaseErrorText}>{currentLang === 'pl' ? 'Oops! Coś poszło nie tak podczas próby dostępu do bazy danych. Prosimy o cierpliwość, pracujemy nad rozwiązaniem tego problemu' : 'Oops! Something went wrong while trying to access the database. Please be patient, we\'re working on resolving this issue.'}</Text>
        </View>
    )
}

export default databaseError