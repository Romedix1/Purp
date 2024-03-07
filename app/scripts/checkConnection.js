import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

// Function to checking internet connection
const useNetInfo = () => {
  const [netInfo, setNetInfo] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetInfo(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return netInfo;
};

export default useNetInfo;