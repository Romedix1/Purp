import * as SecureStore from 'expo-secure-store';

// Function to read ad counter value from secure storage
export const readAdCounter = async () => {
  const value = await SecureStore.getItemAsync('adNumber');
  return value ? parseInt(value, 10) : 1;
};

// Function to ad counter value to secure storage
export const saveAdCounter = async (adNum) => {
  const serializedAd = JSON.stringify(adNum);
  await SecureStore.setItemAsync('adNumber', serializedAd);
};
  