import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';


const { width } = Dimensions.get('window');

const EventList = () => {
  const navigation = useNavigation();
  const [eventos, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('Token no disponible');
        Alert.alert("Error", "No se ha podido obtener el token de autenticación");
        return;
      }

      const response = await axios.get('http://localhost:8080/clk/event/EventosCreados', {
        headers: {
          'x-auth-token': token,
        },
      });
      console.log('Respuesta del servidor:', response.data.eventos);
      if (response.data && response.data.eventos) {
        
        setEvents(response.data.eventos);
      
      } else {
        console.error('No se encontraron datos de eventos');
      }
    } catch (error) {
      if (error.response) {
        console.error('El servidor respondió con un error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('Se realizó la solicitud pero no se recibió respuesta:', error.request);
      } else {
        console.error('Error en la configuración de la solicitud:', error.message);
      }
      Alert.alert("Error", "Error al recibir mensaje del servidor, hable con el administrador del sistema");
    }
  };

  useEffect(() => {
    let socket;
    const initializeSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          const socket = io('http://localhost:8080', {
            query: { token }
          });
  
          socket.on('evento-creado', (nuevoEvento) => {
            setEvents(eventosActuales => [...eventosActuales, nuevoEvento]);
          });
  
          // Guardar la instancia del socket si necesitas usarla más tarde
          // ...
  
        } else {
          console.error('Token no disponible');
          Alert.alert("Error", "No se ha podido obtener el token de autenticación");
        }
      } catch (error) {
        console.error('Error al inicializar Socket.IO:', error);
      }
    };
    

    fetchEvents();
    initializeSocket();

    return () => {
        console.log('Desconectando de Socket.IO');
        if (socket) socket.disconnect();
    };
}, []);

 
  function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

  return (
    <View style={styles.eventSection}>
      <Text style={styles.sectionTitle}>Eventos creados</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventList}>
        {eventos.map((evento, index) => (
          <View key={index} style={styles.eventCard}>
            <View style={styles.eventDetails}>
              <Text>Lugar: {evento.direccion}</Text>
              <Text>Fecha: {formatearFecha(evento.fecha_inicio)}</Text>
              <Text>Hora: {evento.hora_inicio}</Text>
              <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => navigation.navigate('VerEventosDetalles', { id: evento.id_evento })}>
            <Text>Ver más</Text>
            </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Estilos para EventList
const styles = StyleSheet.create({
  eventSection: {
    padding: 20, // El mismo padding que el formulario para alineación
    backgroundColor: '#f2f2f2', // Fondo similar al del formulario
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333', // Texto oscuro para el título
    marginBottom: 15,
    textAlign: 'center',
  },
  eventList: {
    // No necesita un marginBottom ya que cada card tiene su propio espacio
  },
  eventCard: {
    backgroundColor: '#fff', // Fondo blanco para las tarjetas
    width: width * 0.80, // Asumiendo que 'width' es una variable definida
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd', // Borde ligero como en el formulario
    padding: 15, // Padding similar al del input
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, // Elevación más sutil
    marginBottom: 20, // Espacio debajo de cada tarjeta
  },
  eventDetails: {
    marginVertical: 5, // Un poco de espacio vertical para cada detalle
  },
  buttonStyle: {
    backgroundColor: '#5cb85c', // Color verde para que coincida con el botón 'Crear'
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginTop: 10, // Espacio antes del botón
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventList;
