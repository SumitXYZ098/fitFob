import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageAPI = {
  setItem: async (key: string, value: string, ttlMinutes?: number) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error: any) {
      throw new Error(error.message || 'An error occurred during logout.');
    }
  },

  getItem: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error: any) {
      throw new Error(error.message || 'An error occurred during logout.');
    }
  },

  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error: any) {
      throw new Error(error.message || 'An error occurred during logout.');
    }
  },
};
