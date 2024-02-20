import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Image, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Pressable } from 'react-native';
import { useFonts } from "expo-font"; 
import Nav from './nav'; // Import Nav component
import { Link } from 'expo-router';

function playersSelection(props) {
    const [inputValue, setInputValue] = useState('');
    const [inputErr, setInputErr] = useState(false);
    // State for tracking categories on load (button handling)
  
    // Load fonts 
    const [fontsLoaded] = useFonts({
        'LuckiestGuy': require('../../assets/fonts/LuckiestGuy-Regular.ttf'),
    });

    // Set variable with window width
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();

    
    

    function addPlayer() {
        const trimmedValue = inputValue.trim().toUpperCase();
        if (trimmedValue === '' || props.players.includes(trimmedValue)) {
            setInputErr(true);
        } else {
            props.setPlayers([...props.players, trimmedValue]);
            setInputValue('');
            setInputErr(false);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.mainContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Text style={[ styles.mainHeader, { fontSize: .12 * windowWidth, marginTop: .09 * windowWidth }]}>Wprowadz</Text>
            <Text style={[ styles.mainHeader, { color: props.game==="sevenSeconds" ? '#0A6CFF' : '#EB1010', fontSize: .12 * windowWidth, lineHeight: .135 * windowWidth }]}>Graczy</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: .03 * windowWidth, height: .4 * windowHeight }}>
                {props.players.map((player, index) => {
                    return (
                        <View key={index} style={[styles.playerContainer, { width: .75 * windowWidth, backgroundColor: props.game==="sevenSeconds" ? '#001F4D' : '#810C0C', paddingHorizontal: .035 * windowWidth, paddingVertical: .005 * windowWidth, marginTop: .03 * windowWidth }]}>
                            <Text style={[styles.playerText, { fontSize: .065 * windowWidth, width: .59 * windowWidth }]}>{player}</Text>
        
                            <Pressable onPress={() => props.setPlayers(props.players.filter(item => item !== player))}>
                                <Image style={{ transform: [{ scale: .002 * windowWidth }] }} source={require('../../assets/icons/delete-player.png')} />
                            </Pressable>
                        </View>
                    )
                })}
                

                
            </ScrollView>

            <View style={[styles.inputContainer, { marginTop: .09 * windowWidth}]}>
                <TextInput value={inputValue} onChangeText={(text) => setInputValue(text)} onSubmitEditing={addPlayer} style={[styles.playerInput, { paddingLeft: .05 * windowWidth, paddingRight: .12 * windowWidth, paddingVertical: .025 * windowWidth, fontSize: .055 * windowWidth }]}  placeholder="Wpisz nazwę gracza" />  
            
                <Pressable onPress={addPlayer} style={[styles.addPlayerIcon, { transform: [{ scale: .004 * windowWidth }], right: .035 * windowWidth }]}>
                    <Image source={require('../../assets/icons/add-player.png')} />
                </Pressable>
            </View>
            
            {inputErr && <Text style={[styles.inputErr, { fontSize: 0.045 * windowWidth, marginTop: .035 * windowWidth }]}>{props.currentLang === 'pl' ? 'Nazwa gracza nie może być pusta i nie może się powtarzać' : 'Start game'}</Text>}

            <Link asChild href={props.players.length > 0 ? '/sevenSeconds' : '/sevenSecondsGameAddPlayers'} style={[styles.buttonContainer, { marginTop: inputErr ? 0.05 * windowWidth : 0.08 * windowWidth, backgroundColor: props.game==="sevenSeconds" ? '#0536E4' : '#F0000E',  marginBottom: 0.2 * windowWidth }]}>
                <TouchableOpacity>
                    <Text style={[styles.buttonText, { paddingVertical: .005 * windowWidth }]}>{props.currentLang === 'pl' ? 'Rozpocznij grę' : 'Start game'}</Text>
                </TouchableOpacity>
            </Link>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#131313',
        alignItems: 'center',
    },
    mainHeader: {
        fontFamily: 'LuckiestGuy',
        color: '#fff',
    },
    playerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 12,
    },
    playerText: {
        fontFamily: 'LuckiestGuy',
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerInput: {
        backgroundColor: '#fff',
        color: '#fff',
        width: '80%',
        borderRadius: 60,
        color: '#000',
        fontFamily: 'LuckiestGuy',
    },
    addPlayerIcon: {
        position: 'absolute',
    },
    buttonContainer: {
        width: '80%',
        textAlign: 'center',
        borderRadius: 16,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 32,
        fontFamily: 'LuckiestGuy',
        color: '#fff',
    },
    inputErr: {
        color: '#E40000',
        width: '90%',
        textAlign: 'center',
        fontFamily: 'LuckiestGuy',
    }
})

export default playersSelection