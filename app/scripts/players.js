import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to read players from secure storage
export const readPlayers = async () => {
  const value = await AsyncStorage.getItem('players');
  return value ? JSON.parse(value) : [];
};

// Function to save players to secure storage
export const savePlayers = async (players) => {
    const serializedPlayers = JSON.stringify(players);
    await AsyncStorage.setItem('players', serializedPlayers);
};
  