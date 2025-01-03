import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to read the selected language from secure storage
export const readLanguage = async () => {
    const value = await AsyncStorage.getItem('lang');
    return value || 'en';
};

// Function to save the selected language to secure storage
export const saveLanguage = async (lang) => {
    await AsyncStorage.setItem('lang', lang);
};
