import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, useWindowDimensions } from 'react-native';
import { useFonts } from "expo-font";
import { readLanguage } from './scripts/language'; // Import language functions
import { StatusBar } from 'expo-status-bar';

function databaseError() {
    // Set variable with window width and window height using useWindowDimensions hook
    const { width: windowWidth} = useWindowDimensions();
    
    const styles = StyleSheet.create({
        noInternetConnectionContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1E0041',
        },
        noInternetConnectionIcon: {
            resizeMode: 'contain',
            width: .6 * windowWidth,
            height: .6 * windowWidth,
        },
        noInternetConnectionHeader: {
            textAlign: 'center',
            fontFamily: 'LuckiestGuy',
            color: "#fff",
            fontSize: .07 * windowWidth,
            marginTop: .05 * windowWidth
        },
        noInternetConnectionText: {
            width: '95%',
            textAlign: 'center',
            fontFamily: 'LuckiestGuy',
            color: "#fff",
            fontSize: .045 * windowWidth, 
            marginTop: .04 * windowWidth
        }
    })

    // Set current language (default is english)
    const [currentLang, setCurrentLang] = useState("en");

    // Load fonts 
    const [fontsLoaded] = useFonts({
        'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
    });

    // Fetching saved language
    useEffect(() => {
        const fetchData = async () => {
            const lang = await readLanguage();
            setCurrentLang(lang);
        };

        fetchData(); 
    }, []);

    return (
        <View style={styles.noInternetConnectionContainer}>
            <StatusBar backgroundColor='#1E0041' style="light" />
            <Image style={styles.noInternetConnectionIcon} source={require('../assets/icons/databaseErrorIcon.png')}/>
            <Text style={styles.noInternetConnectionHeader}>{currentLang === 'pl' ? 'Błąd połączenia z bazą danych' : 'Database connection error'}</Text>
            <Text style={styles.noInternetConnectionText}>{currentLang === 'pl' ? 'Oops! Coś poszło nie tak podczas próby dostępu do bazy danych. Prosimy o cierpliwość, pracujemy nad rozwiązaniem tego problemu' : 'Oops! Something went wrong while trying to access the database. Please be patient, we\'re working on resolving this issue.'}</Text>
        </View>
    )
}

export default databaseError