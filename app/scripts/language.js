import * as SecureStore from 'expo-secure-store';

// Function to read the selected language from secure storage
export const readLanguage = async () => {
    const value = await SecureStore.getItemAsync('lang');
    return value || 'en';
};

// Function to save the selected language to secure storage
export const saveLanguage = async (lang) => {
    await SecureStore.setItemAsync('lang', lang);
};
