import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://10.0.2.2:3000';

const request = async (method, endpoint, body = null) => {
  const token = await SecureStore.getItemAsync('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro na requisição');
  }

  return data;
};

export default request;