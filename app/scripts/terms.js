import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to read the selected language from secure storage
export const readTerms = async () => {
    const value = await AsyncStorage.getItem('terms');
    return value ? JSON.parse(value) : false;
};

// Function to save the selected language to secure storage
export const saveTerms = async (term) => {
    const serializedPlayers = JSON.stringify(term);
    await AsyncStorage.setItem('terms', serializedPlayers);
};
