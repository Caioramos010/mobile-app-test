import request from './api';

export const getPasswords = async () => {
  return await request('GET', '/passwords');
};

export const savePassword = async (site, username, password) => {
  return await request('POST', '/passwords', { site, username, password });
};

export const deletePassword = async (id) => {
  return await request('DELETE', `/passwords/${id}`);
};

export const generatePassword = async (length = 12) => {
  return await request('GET', `/passwords/generate?length=${length}`);
};