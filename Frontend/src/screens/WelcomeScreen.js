import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RadioButton from '../componentes/Radiobutton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const WelcomeScreen = ({ navigation }) => {
  // Ahora se muestra la pantalla por defecto.
  const [isVisible, setIsVisible] = useState(true);

  const sportsToIds = {
    tenis: 1,
    padel: 2,
    maraton: 3,
    trekking: 4,
   
  };


  const [selectedSports, setSelectedSports] = useState([]);

  const handleSelectSport = (sport) => {
    if (selectedSports.includes(sport)) {
      // Si el deporte ya está seleccionado, quítalo de la lista
      setSelectedSports(selectedSports.filter(s => s !== sport));
    } else {
      // Si el deporte no está seleccionado, agrégalo a la lista
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const handleAccept = async () => {
    try {
      // Obtener el ID del deporte seleccionado
      const sportsIds = selectedSports.map(sport => sportsToIds[sport]);
      if (sportsIds.length === 0) {
        console.error('No se ha seleccionado un deporte');
        return;
      }
  
      // Obtener el token y el ID del usuario almacenado
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('No se ha encontrado el token');
        return;
      }
      
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      if (!userId) {
        console.error('No se ha encontrado el ID del usuario en el token');
        return;
      }
  
      // Preparar la solicitud HTTP
      await axios.post('http://localhost:8080/clk/fav/favoritos', 
      { id_usuario: userId, ids_deportes: sportsIds }, // Usar sportsIds directamente
      { headers: { 'x-auth-token': token } } // Usar el token obtenido
    );
  
      navigation.navigate('Home');
    } catch (error) {
      if (error.response) {
        // La solicitud fue hecha y el servidor respondió con un código de estado
        // que no está en el rango de 2xx
        console.error('Error en la respuesta del servidor:', error.response.status);
        console.error('Mensaje del servidor:', error.response.data);
        console.error('Respuesta del servidor:', error.response);
  
        // Aquí puedes manejar específicamente el error 401
        if (error.response.status === 401) {
          console.error('No autorizado: Token inválido o expirado');
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error('Sin respuesta del servidor:', error.request);
      } else {
        // Algo más causó el error
        console.error('Error al realizar la solicitud:', error.message);
      }
      console.error('Detalles del error:', error.config);
    }
    
  
  };

  const handleDecline = async () => {
       // Obtener el token y el ID del usuario almacenado

       try{
       const token = await AsyncStorage.getItem('jwtToken');
       if (!token) {
         console.error('No se ha encontrado el token');
         return;
       }
       
       const decodedToken = jwtDecode(token);
       const userId = decodedToken.id;
       if (!userId) {
         console.error('No se ha encontrado el ID del usuario en el token');
         return;
       }

       await axios.put(`http://localhost:8080/clk/user/estado/${userId}`, 
       { id_usuario: userId }, // 
       { headers: { 'x-auth-token': token } } // Usar el token obtenido
     );
    navigation.navigate('Home');
    setIsVisible(false);
      }
    catch (error) {
      if (error.response) {
        // La solicitud fue hecha y el servidor respondió con un código de estado
        // que no está en el rango de 2xx
        console.error('Error en la respuesta del servidor:', error.response.status);
        console.error('Mensaje del servidor:', error.response.data);
        console.error('Respuesta del servidor:', error.response);
  
        // Aquí puedes manejar específicamente el error 401
        if (error.response.status === 401) {
          console.error('No autorizado: Token inválido o expirado');
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error('Sin respuesta del servidor:', error.request);
      } else {
        // Algo más causó el error
        console.error('Error al realizar la solicitud:', error.message);
      }
      console.error('Detalles del error:', error.config);
    }
  };

  // Si isVisible es false, no se muestra nada.
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Clicking!</Text>
      <Text style={styles.subtitle}>Escoge tus deportes Favoritos!</Text>

    <View style={styles.radioButtonRow}>
      <RadioButton
        selected={selectedSports.includes('tenis')}
        onPress={() => handleSelectSport('tenis')}
        label="Tenis"
      />
      <RadioButton
         selected={selectedSports.includes('padel')}
        onPress={() => handleSelectSport('padel')}
        label="Padel"
      />
    </View>
      
    <View style={styles.radioButtonRow}>
      <RadioButton
          selected={selectedSports.includes('trekking')}
        onPress={() => handleSelectSport('trekking')}
        label="Trekking"
      />
      <RadioButton
        selected={selectedSports.includes('maraton')}
        onPress={() => handleSelectSport('maraton')}
        label="Maraton"
      />
    </View>

      <TouchableOpacity style={styles.button} onPress={handleAccept}>
        <Text style={styles.buttonText}>Aceptar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonDecline]} onPress={handleDecline}>
        <Text style={styles.buttonText}>Declinar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7', // Un fondo claro pero ligeramente apagado
  },
  title: {
    fontSize: 28,
    fontWeight: '600', // Menos intenso que 'bold' para un look más refinado
    color: '#333', // Un color oscuro para el texto que proporciona mejor contraste
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#808080', // Un gris oscuro para el subtítulo
    marginBottom: 30, // Más espacio antes de los botones
  },
  button: {
    backgroundColor: '#1E90FF', // Un azul profundo pero vibrante
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 30,
    marginVertical: 10,
    alignSelf: 'stretch', // Asume el ancho completo del contenedor
    marginHorizontal: 40, // Espacio lateral para que no llegue al borde
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDecline: {
    backgroundColor: '#808080', // Un gris claro para el botón de Declinar
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
   radioButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Esto separará los botones de radio uniformemente
    alignItems: 'center', // Asegura que los elementos estén alineados verticalmente
    width: '100%', // Asume el ancho total del contenedor
    marginBottom: 20, // Agrega un margen inferior para separar de otros elementos
    paddingHorizontal: 30
  },
});

export default WelcomeScreen;

