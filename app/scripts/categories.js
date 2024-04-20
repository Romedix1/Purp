import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to read categories from secure storage
export const readCategories = async () => {
  const value = await AsyncStorage.getItem('categories');
  return value ? JSON.parse(value) : [];
};

// Function to save categories to secure storage
export const saveCategories = async (categories) => {
    const serializedCategories = JSON.stringify(categories);
    await AsyncStorage.setItem('categories', serializedCategories);
  };
  