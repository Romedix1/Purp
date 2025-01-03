import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

// Custom hook to check internet connection
const useNetInfo = () => {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected;
};

export default useNetInfo;
