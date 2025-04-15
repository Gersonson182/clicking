import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { AppState } from 'react-native'; 

export const AuthContext = createContext();

const TIMEOUT_DURATION = 1000 * 60 * 15;

export const AuthProvider = ({ children }) => {

  const [state, setState] = useState({
    isLoggedIn: false,
    isNewUser: null,
    isLoading: true,
  });


  let inactivityTimer;

  const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
          console.log('Sesión cerrada por inactividad');
          signOut(); // Cerrar sesión automáticamente
      }, TIMEOUT_DURATION);
  };

  useEffect(() => {
      const handleAppStateChange = (nextAppState) => {
          if (nextAppState === 'active') {
              resetInactivityTimer();
          }
      };

      // Añade el listener para AppState
      const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

      // Retorna una función de limpieza que remueve el listener
      return () => {
          appStateSubscription.remove();
      };
  }, []);

  console.log('Estado inicial:', state); // Mostrar el estado inicial

  const signIn = async (token) => {
   
    try {

      if (!token || token.split('.').length !== 3) {
        console.error('Token inválido o mal formateado:', token);
        return; // Detener la ejecución si el token es inválido
      }

  
      await AsyncStorage.setItem('jwtToken', token);
  
      const decodedToken = jwtDecode(token); // Decodificar el token
      const userId = decodedToken.id; // Asumiendo que el ID del usuario está en el payload del token
      const decodedHeader = jwtDecode(token, { header: true });
 

      const firstLoginCheckKey = `hasLoggedInBefore_${userId}`;
      const firstLoginCheck = await AsyncStorage.getItem(firstLoginCheckKey);
    

      if (!firstLoginCheck) {
        await AsyncStorage.setItem(firstLoginCheckKey, 'true');
        setState({ isLoggedIn: true, isNewUser: true, isLoading: false });
      } else {
        setState({ isLoggedIn: true, isNewUser: false, isLoading: false });
      }
      resetInactivityTimer();
    } catch (error) {
      console.error('Error en signIn:', error);
    }
  };

 
  
    const signOut = async () => {
      clearTimeout(inactivityTimer);
      try {
        await AsyncStorage.removeItem('jwtToken');
        // Verificar si el token todavía existe
        const token = await AsyncStorage.getItem('jwtToken');
        if (token === null) {
        } else {
          console.log('El token todavía está almacenado:', token);
        }
        // Actualizar el estado para reflejar que el usuario no está autenticado
        setState({ isLoggedIn: false, isNewUser: null, isLoading: false });
        console.log('Estado actualizado a isLoggedIn: false');
      } catch (error) {
        console.error('Error en signOut:', error);
      }
    };
    
    useEffect(() => {
      const checkAuthState = async () => {
        try {
          console.log('AuthProvider useEffect: Verificando el estado de autenticación');
          const token = await AsyncStorage.getItem('jwtToken');
    
          if (token) {
            // Decodificar el token para obtener el ID del usuario
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            console.log('Token al iniciar:', token); // Registrar el token al iniciar
    
            // Verificar si es la primera vez que el usuario específico inicia sesión
            const firstLoginCheckKey = `hasLoggedInBefore_${userId}`;
            const hasLoggedInBefore = await AsyncStorage.getItem(firstLoginCheckKey);
            console.log('hasLoggedInBefore al iniciar:', hasLoggedInBefore); // Mostrar hasLoggedInBefore al iniciar
    
            const isNewUser = !hasLoggedInBefore;
            setState({ isLoggedIn: true, isNewUser, isLoading: false });
            console.log('Usuario autenticado, isNewUser:', isNewUser);
          } else {
            setState({ isLoggedIn: false, isNewUser: null, isLoading: false });
            console.log('Usuario no autenticado');
          }
          console.log('AuthProvider useEffect: Estado después de verificar:', state);
        } catch (error) {
          console.error('Error al verificar el estado de autenticación:', error);
          setState({ isLoggedIn: false, isNewUser: null, isLoading: false });
        }
      };
    
      checkAuthState();
    }, []);
    
  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut,resetInactivityTimer }}>
      {children}
    </AuthContext.Provider>
  );
};

