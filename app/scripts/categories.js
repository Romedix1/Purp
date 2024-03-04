import * as SecureStore from 'expo-secure-store';

// Function to read categories from secure storage
export const readCategories = async () => {
  try {
    const value = await SecureStore.getItemAsync('categories');
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error while reading data:', error);
    return [];
  }
};

// Function to save categories to secure storage
export const saveCategories = async (categories) => {
    try {
      const serializedCategories = JSON.stringify(categories);
      await SecureStore.setItemAsync('categories', serializedCategories);
      // console.log('Kategorie zostały zapisane:', serializedCategories);
    } catch (error) {
      console.error('Error while saving data: ', error);
    }
  };
  