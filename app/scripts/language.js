import * as SecureStore from 'expo-secure-store';

// Function to read the selected language from secure storage
export const readLanguage = async () => {
  try {
    const value = await SecureStore.getItemAsync('lang');
    return value || 'en';
  } catch (error) {
    console.error('Error while reading data: ', error);
    return 'en';
  }
};

// Function to save the selected language to secure storage
export const saveLanguage = async (lang) => {
  try {
    await SecureStore.setItemAsync('lang', lang);
  } catch (error) {
    console.error('Error while saving data: ', error);
  }
};
