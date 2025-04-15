import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../componentes/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import DeportesFavScreen from '../screens/WelcomeScreen';
import Registro from '../screens/RegistroScreen';
import PerfilAmigos from '../screens/PerfilScreen';
import EventScreen from '../screens/EventScreen'
import VerEventosDetalles from '../screens/VerEventosDetalles';
import VerEventosHome from '../screens/VerEventoHome';
import VerEventosQueParticipa from '../screens/VerEventosQueParticipa'
import PerfilScreenPersonal from '../screens/PerfilPersonal';
import ModificarPerfilPersonal from '../screens/ModificarPerfil'
import ListaAmigosUser from '../screens/ListadeAmigosUser';
import PostsList from '../screens/ListarPosts';
import PostSCrear from '../screens/PostsUser'
import { useNavigation } from '@react-navigation/native';


const Stack = createStackNavigator();

const AppStackNavigator = () => {
  const { isLoggedIn, isNewUser } = useContext(AuthContext);
  const navigation = useNavigation();

 

  useEffect(() => {
    console.log(`AppStackNavigator useEffect: isLoggedIn = ${isLoggedIn}, isNewUser = ${isNewUser}`);
    let targetScreen;

    if (isLoggedIn) {
      // Si el usuario está registrado, decide entre 'DeportesFav' y 'Home'
      targetScreen = isNewUser ? 'DeportesFav' : 'Home';
    } else {
      // Si el usuario no está registrado, siempre navega a 'Home'
      targetScreen = 'Login';
      
    }
  
    console.log(`AppStackNavigator useEffect: Navegando a ${targetScreen}`);
    navigation.navigate(targetScreen);

  }, [isLoggedIn, isNewUser, navigation]);
  
  
  

  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} options={{headerLeft: () => null,}}/>
      <Stack.Screen name="DeportesFav" component={DeportesFavScreen} options={{headerLeft: () => null,}} />
      <Stack.Screen name="PostsList" component={PostsList} />
      <Stack.Screen name="PostCrear" component={PostSCrear} />
      <Stack.Screen name="VerEventosHome" component={VerEventosHome} />
      <Stack.Screen name="PerfilPersonal" component={PerfilScreenPersonal} />
      <Stack.Screen name="ListaAmigosUser" component={ListaAmigosUser} />
      <Stack.Screen name="SignUp" component={Registro} />
      <Stack.Screen name="PerfilScreen" component={PerfilAmigos} />
      <Stack.Screen name="EventScreen" component={EventScreen} />
      <Stack.Screen name="VerEventosDetalles" component={VerEventosDetalles} />
      <Stack.Screen name="VerEventosParticipa" component={VerEventosQueParticipa} />
      <Stack.Screen name="ModificarPerf" component={ModificarPerfilPersonal} />
    </Stack.Navigator>
  );
};

export default AppStackNavigator;


