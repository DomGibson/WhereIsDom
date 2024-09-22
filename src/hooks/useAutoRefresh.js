// src/hooks/useAutoRefresh.js
import { useEffect } from 'react';

const useAutoRefresh = (callback, interval = 15000) => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      callback(); // Call the function passed in every `interval` milliseconds
    }, interval);

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [callback, interval]);
};

export default useAutoRefresh;
