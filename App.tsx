import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
//import AppLoading from 'expo-app-loading'; 
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from 'styled-components';
import { 
  useFonts,
  Inter_400Regular,
  Inter_500Medium
 } from '@expo-google-fonts/inter';
import { 
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold
} from '@expo-google-fonts/archivo';

import { Home } from './src/screens/Home';
import { Routes } from './src/routes';

import theme from './src/styles/theme';

export default function App() {
  SplashScreen.preventAutoHideAsync();

  const [ fontsLoaded ] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold
  });

  if(!fontsLoaded){
    // se a fonte não tiver carregada, aguardar...
    return null;
  }

  SplashScreen.hideAsync();
 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
   </GestureHandlerRootView>
  )
}