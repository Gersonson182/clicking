// Importa los módulos y componentes necesarios
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const UserEventsList = () => {
  const [eventos, setEventos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          Alert.alert("Error", "No se ha podido obtener el token de autenticación");
          return;
        }
        const response = await axios.get('http://localhost:8080/clk/event/EventoUnidoUser', {
          headers: {
            'x-auth-token': token
          }
        });
        setEventos(response.data.eventos); // Suponiendo que 'eventos' es el array de eventos
      } catch (error) {
        console.error('Error al obtener eventos:', error);
        Alert.alert("Error", "No se pudieron obtener los eventos");
      }
    };

    fetchUserEvents();
  }, []);

  function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

  return (
    <View style={styles.eventSection}>
      <Text style={styles.sectionTitle}>Eventos que participa</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventList}>
        {eventos.map((evento, index) => (
          <View key={index} style={styles.eventCard}>
            <View style={styles.eventDetails}>
              <Text>Lugar: {evento.direccion}</Text>
              <Text>Fecha:{formatearFecha(evento.fecha_inicio)}</Text>
              {/* Agrega aquí más detalles que quieras mostrar */}
            </View>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => navigation.navigate('VerEventosParticipa', { id: evento.id_evento })}>
              <Text style={styles.buttonText}>Ver más</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  eventSection: {
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  eventList: {
    // Los estilos se aplican al contenedor ScrollView
  },
  eventCard: {
    backgroundColor: '#fff',
    width: width * 0.80,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 20,
  },
  eventDetails: {
    marginVertical: 5,
  },
  buttonStyle: {
    backgroundColor: '#5cb85c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserEventsList;