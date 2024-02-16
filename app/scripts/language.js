import * as SecureStore from 'expo-secure-store';

export const readLanguage = async () => {
  try {
    const value = await SecureStore.getItemAsync('lang');
    return value || 'en';
  } catch (error) {
    console.error('Błąd podczas odczytywania danych:', error);
    return 'en';
  }
};

export const saveLanguage = async (lang) => {
  try {
    await SecureStore.setItemAsync('lang', lang);
    console.log('Język został zapisany.');
  } catch (error) {
    console.error('Błąd podczas zapisywania danych:', error);
  }
};
