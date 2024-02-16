// FontLoader.js
import React, { useCallback } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo';

const Font = () => {
  const [fontsLoaded] = useFonts({
    'LuckiestGuy': require('../../assets/fonts/LuckiestGuy-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
};

export default Font;
