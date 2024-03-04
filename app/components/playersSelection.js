import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Image, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Pressable } from 'react-native';
import { useFonts } from "expo-font"; 
import { Link } from 'expo-router';
import { FlatList } from 'react-native-gesture-handler';

function playersSelection(props) {
    // Set variable with window width and window height using useWindowDimensions hook
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();

    const styles = StyleSheet.create({
        mainContainer: {
            backgroundColor: '#131313',
            alignItems: 'center',
        },
        mainHeader: {
            fontFamily: 'LuckiestGuy',
            color: '#fff',
            fontSize: .12 * windowWidth, 
        },
        playersListContainer: {
            marginTop: .03 * windowWidth, 
            height: .4 * windowHeight
        },
        playerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 0.036 * windowWidth,
            paddingHorizontal: .03 * windowWidth, 
            width: .75 * windowWidth,
            paddingVertical: .005 * windowWidth, 
            marginTop: .03 * windowWidth
        },
        playerText: {
            fontFamily: 'LuckiestGuy',
            color: '#fff',
            fontSize: .065 * windowWidth, 
            width: .59 * windowWidth,
        },
        deletePlayerIcon: {
            resizeMode: 'contain',
            width: .09 * windowWidth, 
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: .09 * windowWidth
        },
        playerInput: {
            backgroundColor: '#fff',
            color: '#fff',
            width: '80%',
            borderRadius: 99999,
            color: '#000',
            fontFamily: 'LuckiestGuy',
        },
        addPlayerIconContainer: {
            position: 'absolute',
            right: .015 * windowWidth
        },
        addPlayerIcon: {
            resizeMode: 'contain',
            width: .12 * windowWidth, 
        },
        buttonContainer: {
            width: '80%',
            textAlign: 'center',
            borderRadius: .03 * windowWidth,
            marginBottom: .2 * windowWidth,
            paddingVertical: .008 * windowWidth
        },
        buttonText: {
            textAlign: 'center',
            fontSize: .08 * windowWidth,
            fontFamily: 'LuckiestGuy',
            color: '#fff',
            paddingVertical: .005 * windowWidth
        },
        inputError: {
            color: '#E40000',
            width: '90%',
            textAlign: 'center',
            fontFamily: 'LuckiestGuy',
            fontSize: .045 * windowWidth, 
            marginTop: .035 * windowWidth
        }
    })
    
    // State for storing the input value entered by the user
    const [inputValue, setInputValue] = useState('');
    // State for tracking if there's an error with the input
    const [inputErr, setInputErr] = useState(false);
  
    // Load fonts 
    const [fontsLoaded] = useFonts({
        'LuckiestGuy': require('../../assets/fonts/LuckiestGuy-Regular.ttf'),
    });

    // Function to add a player to the list
    function addPlayer() {
        // Trim and convert input value to uppercase    
        const trimmedValue = inputValue.trim().toUpperCase();

        // Check if the trimmed value is empty, already exists in the list of players, or exceeds 20 characters
        if (trimmedValue === '' || props.players.includes(trimmedValue) || trimmedValue.length>20) {
            setInputErr(true);
        } else {
            props.setPlayers([...props.players, trimmedValue]);
            setInputValue('');
            setInputErr(false);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.mainContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Text style={[ styles.mainHeader, { marginTop: .09 * windowWidth }]}>Wprowadz</Text>
            <Text style={[ styles.mainHeader, { color: props.game==="sevenSeconds" ? '#0A6CFF' : '#EB1010', lineHeight: .135 * windowWidth }]}>Graczy</Text>

            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={styles.playersListContainer}>
                {props.players.map((player, index) => {
                    return (
                        <View key={index} style={[styles.playerContainer, { backgroundColor: props.game==="sevenSeconds" ? '#001F4D' : '#810C0C' }]}>
                            <Text style={styles.playerText}>{player}</Text>
        
                            <Pressable onPress={() => props.setPlayers(props.players.filter(item => item !== player))}>
                                <Image style={styles.deletePlayerIcon} source={require('../../assets/icons/delete-player.png')} />
                            </Pressable>
                        </View>
                    )
                })}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput value={inputValue} onChangeText={(text) => setInputValue(text)} onSubmitEditing={addPlayer} style={[styles.playerInput, { paddingLeft: .05 * windowWidth, paddingRight: .12 * windowWidth, paddingVertical: .025 * windowWidth, fontSize: .055 * windowWidth }]}  placeholder="Wpisz nazwę gracza" />  
            
                <Pressable onPress={addPlayer} style={styles.addPlayerIconContainer}>
                    <Image style={styles.addPlayerIcon} source={require('../../assets/icons/add-player.png')} />
                </Pressable>
            </View>
            
            {inputErr && <Text style={styles.inputError}>{props.currentLang === 'pl' ? 'Nazwa gracza nie może być pusta, nie może się powtarzać i musi być krótsza niż 20 znaków' : "The player's name cannot be empty, cannot be repeated, and must be shorter than 20 characters"}</Text>}

            <Link asChild href={props.game==="sevenSeconds" ? (props.players.length > 0 ? '/sevenSeconds' : '/sevenSecondsGameAddPlayers') : (props.players.length > 0 ? '/truthOrDare' : '/truthOrDareAddPlayers') } style={[styles.buttonContainer, { marginTop: inputErr ? .05 * windowWidth : .08 * windowWidth, backgroundColor: props.game==="sevenSeconds" ? '#0536E4' : '#F0000E' }]}>
                <TouchableOpacity>
                    <Text style={styles.buttonText}>{props.currentLang === 'pl' ? 'Rozpocznij grę' : 'Start game'}</Text>
                </TouchableOpacity>
            </Link>

        </KeyboardAvoidingView>
    )
}

export default playersSelection