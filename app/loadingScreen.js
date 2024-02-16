import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, useWindowDimensions, Animated, Easing} from 'react-native';
import Font from './scripts/font';
import { useFonts } from "expo-font";

function loadingScreen() {
    // Set variable with window width
    const { width: windowWidth} = useWindowDimensions();
    // const logoScale = useRef(new Animated.Value(0)).current;
    const [logoScale] = useState(new Animated.Value(1));

    // Load fonts 
    const [fontsLoaded] = useFonts({
        'LuckiestGuy': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
    });

    useEffect(() => {
        animateLogo();
    }, []);
    
    const animateLogo = () => {
        Animated.sequence([
            Animated.timing(logoScale, {
                toValue: .0038 * windowWidth,
                duration: 600,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(logoScale, {
                toValue: .003 * windowWidth,
                duration: 600,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start(() => {
            animateLogo();
        });
    };

    return (
        <View style={styles.loadingScreenContainer}>
            <Animated.Image style={{ transform: [{ scale: logoScale }] }} source={require('../assets/icons/logo.png')}/>
            <Text style={[styles.loadingScreenHeader, { fontSize: .15 * windowWidth, marginTop: .13 * windowWidth }]}>Purp</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    loadingScreenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E0041',
    },
    loadingScreenHeader: {
        fontFamily: 'LuckiestGuy',
        color: "#fff",
    }
})

export default loadingScreen;