import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, useWindowDimensions } from 'react-native';
import { useFonts } from "expo-font";
import { readLanguage } from './scripts/language'; // Import language functions

function connectionError() {
    // Set variable with window width and window height using useWindowDimensions hook
    const { width: windowWidth} = useWindowDimensions();
    
    const styles = StyleSheet.create({
        noInternetConnectionContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1E0041',
        },
        noInternetConnectionHeader: {
            textAlign: 'center',
            fontFamily: 'LuckiestGuy',
            color: "#fff",
            fontSize: .085 * windowWidth, 
            marginTop: .05 * windowWidth
        },
        noInternetConnectionText: {
            width: '95%',
            textAlign: 'center',
            fontFamily: 'LuckiestGuy',
            color: "#fff",
            fontSize: .051 * windowWidth, 
            marginTop: .04 * windowWidth,
            lineHeight: .073 * windowWidth
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
            <Image style={styles.noInternetConnectionIcon} source={require('../assets/icons/noInternetConnectionIcon.png')}/>
            <Text style={styles.noInternetConnectionHeader}>{currentLang === 'pl' ? 'Brak połączenia z internetem' : 'Internet connection lost'}</Text>
            <Text style={styles.noInternetConnectionText}>{currentLang === 'pl' ? 'Przepraszamy, ale wygląda na to, że nie masz obecnie połączenia z internetem. Prosimy o sprawdzenie swojego połączenia sieciowego i spróbowanie ponownie za chwilę.' : 'We\'re sorry, but it seems you currently don\'t have an internet connection. Please check your network connection and try again shortly.'}</Text>
        </View>
    )
}

export default connectionError