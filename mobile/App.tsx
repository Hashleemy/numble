import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { LandingScreen }  from './src/screens/LandingScreen';
import { LoginScreen }    from './src/screens/LoginScreen';
import { GameScreen }     from './src/screens/GameScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { useAuthStore }   from './src/store/authStore';
import { useSettingsStore } from './src/store/settingsStore';
import { LIGHT, DARK } from './src/lib/theme';

export type RootStackParamList = {
  Landing:  undefined;
  Login:    undefined;
  Game:     undefined;
  GameOver: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const init     = useAuthStore((s) => s.init);
  const loading  = useAuthStore((s) => s.loading);
  const darkMode = useSettingsStore((s) => s.darkMode);
  const C        = darkMode ? DARK : LIGHT;

  useEffect(() => {
    init();
  }, [init]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg }}>
        <ActivityIndicator size="large" color={C.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name="Landing"  component={LandingScreen}  />
        <Stack.Screen name="Login"    component={LoginScreen}    />
        <Stack.Screen name="Game"     component={GameScreen}     />
        <Stack.Screen name="GameOver" component={GameOverScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
