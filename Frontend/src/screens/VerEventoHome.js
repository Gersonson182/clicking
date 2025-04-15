import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Participantes from '../componentes/ParticipantesContador'
import BotonParticipar from '../componentes/BotonParaParticipar'
import BotonSalir from '../componentes/BotonSalirEvento';

const VerEventosHome = ({ route }) => {
  const { id } = route.params;
  const [evento, setEvento] = useState(null);
  const [token, setToken] = useState('');
  const [estaParticipando, setEstaParticipando] = useState(false);

   useEffect(() => {
   const fetchToken = async () => {
    const retrievedToken = await AsyncStorage.getItem('jwtToken');
    setToken(retrievedToken);
  };

  fetchToken();
}, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          console.error('Token no disponible');
          Alert.alert("Error", "No se ha podido obtener el token de autenticación");
          return;
        }

        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        // Asegúrate de reemplazar '(id_evento)' con el valor real de 'id' en la URL
        const response = await axios.get(`http://localhost:8080/clk/event/eventoPorIDevento/${id}`, config)

        console.log('Respuesta del servidor:', response.data);
      if (response.data && response.data.eventos && response.data.eventos.length > 0) {
        setEvento(response.data.eventos[0]);
      } else {
        console.error('No se encontraron datos del evento');
        Alert.alert("Error", "No se encontraron datos del evento");
      }
    } catch (error) {
      console.error('Error al obtener detalles del evento:', error);
      Alert.alert("Error", "Error al obtener detalles del evento");
    }
  };

  fetchEventDetails();
}, [id]);



useEffect(() => {
  const verificarParticipacion = async () => {
    try {
      // Reemplazar 'token' con la forma en que obtienes el token actualmente,
      // por ejemplo, de AsyncStorage o de un contexto global de autenticación
      const token = await AsyncStorage.getItem('jwtToken');

      if (!token) {
        throw new Error("No hay token de autenticación disponible.");
      }

      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      // La URL del endpoint debe ser la que tu backend proporciona para verificar la participación
      const url = `http://localhost:8080/clk/participantes/eventos/${id}`;

      const response = await axios.get(url, config);

      // La respuesta del backend debería indicar si el usuario está participando o no
      // Esto dependerá de cómo esté diseñado tu backend
      if (response.data.estaParticipando) {
        setEstaParticipando(true);
      } else {
        setEstaParticipando(false);
      }
    } catch (error) {
      console.error("Error al verificar la participación en el evento", error);
      Alert.alert("Error", "No se pudo verificar la participación en el evento.");
    }
  };

  verificarParticipacion();
}, [id]);

  if (!evento) {
    return <Text>Cargando...</Text>;
  }

   
  function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}
  // Ejemplo de array de participantes, lo ideal sería que esto viniera de tu estado o props
  const participants = new Array(10).fill(0); // Esto creará un array con 10 participantes

  return (
  
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../img/tenis.png')} style={styles.image} />
      </View>
      <View style={styles.detailsContainer}>
       <Text>ID del Evento: {evento.id_evento}</Text>
        <Text style={styles.titleText}>Nombre del evento: {evento.nombre}</Text>
        <Text style= {styles.textStyle}>Fecha: {formatearFecha(evento.fecha_inicio)}</Text>
        <Text style= {styles.textStyle}>Hora: {evento.hora}</Text>
        <Text style= {styles.textStyle}>Dirección: {evento.direccion}</Text>
        <Text style= {styles.textStyle}>Deporte: {evento.nombre_deporte}</Text>
      </View>

      <Participantes idEvento={evento.id_evento} />
      {estaParticipando ? (
        <BotonSalir idEvento={evento.id_evento} token={token} onSalirDelEvento={() => setEstaParticipando(false)} />
      ) : (
        <BotonParticipar idEvento={evento.id_evento} token={token} onParticiparEnEvento={() => setEstaParticipando(true)} />
      )}
    </ScrollView>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    // Estilos para el contenedor de la imagen
  },
  image: {
    width: '100%',
    height: 200, // Define el alto de tu imagen
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  textStyle: {
    fontSize: 18, // Ajusta este valor según tus necesidades
    // Puedes añadir otros estilos aquí si lo necesitas
  },
 
 
});

export default VerEventosHome;
