import * as SecureStore from 'expo-secure-store';

// Function to read players from secure storage
export const readPlayers = async () => {
  try {
    const value = await SecureStore.getItemAsync('players');
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error while reading data: ', error);
    return [];
  }
};

// Function to save players to secure storage
export const savePlayers = async (players) => {
    try {
      const serializedPlayers = JSON.stringify(players);
      await SecureStore.setItemAsync('players', serializedPlayers);
    } catch (error) {
      console.error('Error while saving data: ', error);
    }
  };
  