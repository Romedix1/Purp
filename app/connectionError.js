import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, useWindowDimensions } from 'react-native';
import { useFonts } from "expo-font";
import { readLanguage } from './scripts/language'; // Import language functions

function loadingScreen() {
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
            <Image style={styles.noInternetConnectionIcon} source={require('../assets/icons/noInternetConnectionIcon.png')}/>
            <Image style={styles.noInternetConnectionIcon} source={require('../assets/icons/noInternetConnectionIconRed.png')}/>
            <Text style={styles.noInternetConnectionHeader}>Brak połączenia z internetem</Text>
            <Text style={styles.noInternetConnectionText}>Przepraszamy, ale wygląda na to, że nie masz obecnie połączenia z internetem. Prosimy o sprawdzenie swojego połączenia sieciowego i spróbowanie ponownie za chwilę.</Text>
        </View>
    )
}

export default loadingScreen