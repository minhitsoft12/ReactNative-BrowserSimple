import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Browser from './Browser';
import History from './History';
import * as Linking from 'expo-linking';

const Stack = createStackNavigator();

const prefix = Linking.createURL('/');

export default function App() {
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Browser: 'browser',
        History: 'history',
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Browser">
        <Stack.Screen name="Browser" component={Browser} options={{ headerShown: false }} />
        <Stack.Screen name="History" component={History} options={{ title: 'Browsing History' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}