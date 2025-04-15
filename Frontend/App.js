// App.js
import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './src/componentes/AuthContext';
import AppStackNavigator from './src/navegacion/AppStackNavigator';
import { ActivityIndicator, AppState } from 'react-native';
import { Buffer } from 'buffer';

global.Buffer = Buffer; // Añadir Buffer para su uso global

if (!global.btoa) {
  global.btoa = (input) => Buffer.from(input, 'binary').toString('base64');
}

if (!global.atob) {
  global.atob = (input) => Buffer.from(input, 'base64').toString('binary');
}


const AppContent = () => {
  
  const { isLoading, resetInactivityTimer } = useContext(AuthContext);

  useEffect(() => {
    // Escuchar cambios en el estado de la aplicación
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        resetInactivityTimer(); // Reiniciar el temporizador al volver a estar activa la aplicación
      }
    });

    return () => subscription.remove(); // Limpiar el listener al desmontar
  }, [resetInactivityTimer]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <NavigationContainer>
      <AppStackNavigator />
    </NavigationContainer>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;










