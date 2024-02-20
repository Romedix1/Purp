import * as SecureStore from 'expo-secure-store';

export const readCategories = async () => {
  try {
    const value = await SecureStore.getItemAsync('categories');
    return value ? JSON.parse(value) : "";
  } catch (error) {
    console.error('Błąd podczas odczytywania danych:', error);
    return [];
  }
};

export const saveCategories = async (categories) => {
    try {
      const serializedCategories = JSON.stringify(categories);
      await SecureStore.setItemAsync('categories', serializedCategories);
      // console.log('Kategorie zostały zapisane:', serializedCategories);
    } catch (error) {
      console.error('Błąd podczas zapisywania danych:', error);
    }
  };
  