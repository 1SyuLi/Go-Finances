import React from 'react';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import { StatusBar } from 'react-native';
import AppLoading from 'expo-app-loading';
import theme from './src/Global/Styles/theme';
import { Routes } from './src/routes';
import { ThemeProvider } from 'styled-components';
import { AuthProvider, useAuth } from './src/hooks/auth';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'


export default function App() {

  const { userStorageLoading } = useAuth();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if(!fontsLoaded || userStorageLoading){
    return <AppLoading />
  }

  return (
    <>
      <StatusBar backgroundColor="#5636d3" barStyle="light-content"/>
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Routes />
            </AuthProvider>
        </ThemeProvider>
    </>
  )
}
