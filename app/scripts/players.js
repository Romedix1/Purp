import * as SecureStore from 'expo-secure-store';

// Function to read players from secure storage
export const readPlayers = async () => {
  const value = await SecureStore.getItemAsync('players');
  return value ? JSON.parse(value) : [];
};

// Function to save players to secure storage
export const savePlayers = async (players) => {
    const serializedPlayers = JSON.stringify(players);
    await SecureStore.setItemAsync('players', serializedPlayers);
};
  