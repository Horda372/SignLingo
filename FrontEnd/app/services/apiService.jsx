const axios = require('axios');
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://192.168.170.235:8000/api',
});

async function signIn(email, password) {
  try {
    console.log('here')
    const res = await API.post('/login/', { email, password });
    console.log(res.data)
    await AsyncStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    console.error('SignIn Error:', error.message);
    throw error;
  }
}

async function signUp(username, password, email) {
  try {
    const res = await API.post('/register/', { username, password, email });
    await AsyncStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    console.error('SignUp Error:', error.message);
    throw error;
  }
}

async function signOut() {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('SignOut Error:', error.message);
    throw error;
  }
}

module.exports = { signIn, signUp, signOut };
