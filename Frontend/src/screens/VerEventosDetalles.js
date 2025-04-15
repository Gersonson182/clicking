import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Participantes from '../componentes/ParticipantesContador'
import BotonFinalizarEvento from '../componentes/BotonFinalizar';



const VerEventosDetalles = ({ route }) => {
  const { id } = route.params;
  const [evento, setEvento] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const retrievedToken = await AsyncStorage.getItem('jwtToken');
        if (!retrievedToken) {
          console.error('Token no disponible');
          Alert.alert("Error", "No se ha podido obtener el token de autenticación");
          return;
        }

        setToken(retrievedToken); // Establecer el token en el estado

        const config = {
          headers: {
            'x-auth-token': retrievedToken
          }
        };

        const response = await axios.get(`http://localhost:8080/clk/event/eventoPorIDevento/${id}`, config);
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

  if (!evento) {
    return <Text>Cargando...</Text>;
  }

  function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  }

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
      <BotonFinalizarEvento idEvento={evento.id_evento}/>
      
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

export default VerEventosDetalles;
