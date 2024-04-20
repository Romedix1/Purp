import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to read ad counter value from secure storage
export const readAdCounter = async () => {
  const value = await AsyncStorage.getItem('adNumber');
  return value ? parseInt(value, 10) : 1;
};

// Function to ad counter value to secure storage
export const saveAdCounter = async (adNum) => {
  const serializedAd = JSON.stringify(adNum);
  await AsyncStorage.setItem('adNumber', serializedAd);
};
  