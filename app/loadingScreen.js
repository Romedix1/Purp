import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Animated, Easing} from 'react-native';
import { useFonts } from "expo-font";
import { StatusBar } from 'expo-status-bar';

function loadingScreen() {
    // Set variable with window width and window height using useWindowDimensions hook
    const { width: windowWidth} = useWindowDimensions();
    
    const styles = StyleSheet.create({
        loadingScreenContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1E0041',
        },
    })

    // Define state for logo scale animation
    const [logoScale] = useState(new Animated.Value(.65));

    // Load fonts 
    const [fontsLoaded] = useFonts({
        'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
    });

    useEffect(() => {
        // Trigger logo animation when component mounts
        animateLogo();
    }, []);
    
    const animateLogo = () => {
        Animated.sequence([
            Animated.timing(logoScale, {
                toValue: .0019 * windowWidth,
                duration: 800,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(logoScale, {
                toValue: .0012 * windowWidth,
                duration: 800,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Restart animation when completed
            animateLogo();
        });
    };

    return (
        <View style={styles.loadingScreenContainer}>
            <StatusBar backgroundColor='#1E0041' style="light" />
            <Animated.Image style={{ transform: [{ scale: logoScale }] }} source={require('../assets/icons/logo.png')}/>
        </View>
    )
}

export default loadingScreen