import * as SecureStore from 'expo-secure-store';

// Function to read categories from secure storage
export const readCategories = async () => {
  const value = await SecureStore.getItemAsync('categories');
  return value ? JSON.parse(value) : [];
};

// Function to save categories to secure storage
export const saveCategories = async (categories) => {
    const serializedCategories = JSON.stringify(categories);
    await SecureStore.setItemAsync('categories', serializedCategories);
  };
  