import * as SecureStore from 'expo-secure-store';

export const readPlayers = async () => {
  try {
    const value = await SecureStore.getItemAsync('players');
    return value ? JSON.parse(value) : "";
  } catch (error) {
    console.error('Błąd podczas odczytywania danych:', error);
    return [];
  }
};

export const savePlayers = async (players) => {
    try {
      const serializedPlayers = JSON.stringify(players);
      await SecureStore.setItemAsync('players', serializedPlayers);
      console.log('players zostały zapisane:', serializedPlayers);
    } catch (error) {
      console.error('Błąd podczas zapisywania danych:', error);
    }
  };
  