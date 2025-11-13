import AsyncStorage from '@react-native-async-storage/async-storage';

export const save = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage save error', e);
  }
};

export const load = async (key, fallback = null) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn('Storage load error', e);
    return fallback;
  }
};

export const remove = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {}
};
