import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to read terms from local storage
export const readTerms = async () => {
    const value = await AsyncStorage.getItem('terms');
    return value ? JSON.parse(value) : false;
};

// Function to save terms to local storage
export const saveTerms = async (term) => {
    const serializedTerms = JSON.stringify(term);
    await AsyncStorage.setItem('terms', serializedTerms);
};
