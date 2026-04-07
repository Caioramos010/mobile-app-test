import * as SecureStore from 'expo-secure-store';
import request from './api';

export const signIn = async (email, password) => {
  const data = await request('POST', '/auth/signin', { email, password });
  await SecureStore.setItemAsync('token', data.token);
  return data;
};

export const signUp = async (name, email, password) => {
  const data = await request('POST', '/auth/signup', { name, email, password });
  return data;
};

export const signOut = async () => {
  await SecureStore.deleteItemAsync('token');
};