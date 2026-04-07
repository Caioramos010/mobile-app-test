import React from 'react';
import HomeScreen from './src/components/HomeScreen';
import ListScreen from './src/components/ListScreen';
import SignIn from './src/components/SignIn';
import SignUp from './src/components/SignUp';
import { View, Text } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'SignIn',
  screens: {
    SignIn: {
      screen: SignIn,
      options: { title: 'Entrar' }
    },
    SignUp: {
      screen: SignUp,
      options: { title: 'Cadastrar' }
    },
    Home: {
      screen: HomeScreen,
      options: { title: 'Home' }
    },
    List: {
      screen: ListScreen,
      options: { title: 'Histórico' }
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}