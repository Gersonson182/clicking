import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../componentes/AuthContext';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
 
  const [correo, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);
  const navigation = useNavigation();

  const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async () => {
    console.log('LoginScreen handleLogin: Iniciando proceso de login');
    if (!isValidEmail(correo)) {
      console.log(correo);
      Alert.alert('Error', 'Introduce un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      console.log('LoginScreen handleLogin: Enviando petición de inicio de sesión a servidor');

      console.log('Enviando petición para iniciar sesión');
      const response = await axios.post('http://localhost:8080/clk/auth/login', {
        correo,
        password,
        
      });
      
      console.log('Respuesta del servidor:', response.data);
  
      const jwtToken = response.data.token;
      console.log('Token recibido:', jwtToken);

      console.log('Llamando a signIn con el token');
      await signIn(jwtToken); // Utiliza signIn para actualizar el estado de autenticación
      console.log(jwtToken);

    
  
      console.log('LoginScreen handleLogin: Respuesta recibida, token:', jwtToken);
    } catch (error) {
      // Manejo de errores de la petición
      if (error.response) {
        // Errores que responden del servidor, como credenciales incorrectas
        Alert.alert('Error de Inicio de Sesión', error.response.data.message || 'Error al iniciar sesión');
        console.error('LoginScreen handleLogin: Error en el inicio de sesión', error);
      } else if (error.request) {
        // Errores que ocurren al hacer la solicitud
        Alert.alert('Error de Conexión', 'No se pudo establecer una conexión con el servidor');
      } else {
        // Otros errores
        Alert.alert('Error', 'Ha ocurrido un error inesperado');
        console.error('Error completo:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clicking</Text>
      <TextInput style={styles.input} placeholder="Correo electrónico"
      value={correo}
      onChangeText={setEmail}
      keyboardType="email-address"/>
      <TextInput style={styles.input} placeholder="Contraseña" 
      secureTextEntry 
      value={password}
      onChangeText={setPassword}/>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton}>
   
      <Text style={styles.googleText}>Iniciar sesión con Google</Text>
      </TouchableOpacity>
      <Text style={styles.signUpText}>
  ¿No tienes una cuenta?{' '}
  <TouchableOpacity  onPress={() => navigation.navigate('SignUp')}>
    <Text style={styles.signUpButton}>Regístrate aquí</Text>
  </TouchableOpacity>
</Text>
    </View>
  );

};

// ... Estilos y exportación como antes

const windowDimensions = Dimensions.get('window');
const windowWidth = windowDimensions.width;
const windowHeight = windowDimensions.height;

// Make sure that calculations result in numeric values
const containerMaxHeight = windowHeight * 0.5; // 50% of the screen height
const containerWidth = windowWidth * 0.90; // 90% of the screen width
const marginTopValue = windowHeight * 0.15; // 15% of the screen height

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#f4f7f6',
      padding: 30,
      maxHeight: !isNaN(containerMaxHeight) ? containerMaxHeight : 400, // Fallback to 400 if NaN
      width: !isNaN(containerWidth) ? containerWidth : 400, // Fallback to 400 if NaN
      marginTop: !isNaN(marginTopValue) ? marginTopValue : 150, // Fallback to 150 if NaN
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    input: {
      width: '100%',
      padding: 15,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
    },
    button: {
      width: '100%',
      padding: 15,
      backgroundColor: '#005f73',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOpacity: 0.8,
      elevation: 6,
      shadowRadius: 15 ,
      shadowOffset : { width: 1, height: 13},
      height: 50,
      paddingHorizontal: 25,
      borderRadius: 25,
      marginTop: 10,
    },
   
    googleText: {
      color: 'rgba(0,0,0,0.54)',
      fontSize: 16,
    },
  
      signUpText: {
        marginTop: 20,
      },
      signUpButton: {
        color: 'blue',
        fontWeight: 'bold',
      },
  });
  

export default Login;
