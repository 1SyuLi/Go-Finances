import React from 'react';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import { StatusBar } from 'react-native';
import AppLoading from 'expo-app-loading';
import theme from './src/Global/Styles/theme';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components';
import { AppRoutes } from './src/routes/app.routes';
import { SignIn } from './src/screens/SignIn';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'


export default function App() {

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if(!fontsLoaded){
    return <AppLoading />
  }

  return (
    <>
      <StatusBar backgroundColor="#5636d3" barStyle="light-content"/>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            {/* <AppRoutes /> */}
            <SignIn />
          </NavigationContainer>
        </ThemeProvider>
    </>
  )
}
