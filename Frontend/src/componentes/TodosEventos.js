import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Dimensions,TouchableOpacity, ActivityIndicator  } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';

const { width, height } = Dimensions.get('window');



const eventosVariados = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [eventosPadel, setEventosPadel] = useState([]);
  const [eventosMaraton, setEventosMaraton] = useState([]);
  const [eventosTrekking, setEventosTrekking] = useState([]);
  const [eventosTenis, setEventosTenis] = useState([]);

  const cargarEventos = async (id_deporte, setEventos) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const config = { headers: { 'x-auth-token': token } };
      const response = await axios.get(`http://localhost:8080/clk/event/eventoPorId/${id_deporte}`, config);
      setEventos(response.data.eventos);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  };

  useEffect(() => {
    const cargarTodosLosEventos = async () => {
      setIsLoading(true);
      await Promise.all([
        cargarEventos('2', setEventosPadel),
        cargarEventos('3', setEventosMaraton),
        cargarEventos('4', setEventosTrekking),
        cargarEventos('1', setEventosTenis),
      ]);
      setIsLoading(false);
    };

    cargarTodosLosEventos();
  }, []);
  

  const renderEventos = (eventos, titulo) => {

    const imagenesDeportes = {
      1: require('../img/tenis2.png'),
      2: require('../img/padel.png'),
      3: require('../img/maraton.png'),
      4: require('../img/trekking.png'),
    };

    imagenesDeportes['default'] = require('../img/deportes.png');
   
    
    return (
      <View>
      <Text style={styles.sectionTitle}>{titulo}</Text>
      {eventos.length > 0 ? (
        <ScrollView horizontal>
          {eventos.map((evento) => {
            // Selecciona la imagen basada en el ID del deporte del evento
            const imagenDeporte = imagenesDeportes[evento.id_deporte] || imagenesDeportes['default'];

            return (
              <TouchableOpacity 
                key={evento.id_evento}
                onPress={() => navigation.navigate('VerEventosHome', { id: evento.id_evento })}
                style={[styles.sportCard, dynamicStyles.sportCard]}
              >
                <Image source={imagenDeporte} style={styles.sportImage} />
                <Text style={styles.sportTitle}>{evento.nombre}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <Text>No hay eventos de {titulo} disponibles.</Text>
      )}
    </View>
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      {renderEventos(eventosPadel, 'Pádel')}
      {renderEventos(eventosMaraton, 'Maratón')}
      {renderEventos(eventosTrekking, 'Trekking')}
      {renderEventos(eventosTenis, 'Tenis')}
    </View>
  );
};


 const dynamicStyles = {

    sportCard: {
        width: width / 2 - 20, // Ancho proporcional al tamaño de la pantalla
        shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.1, // Opacidad de sombra diferente para iOS y Android
      },
 }
 const styles = StyleSheet.create({

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10,
      },
      sportCard: {
        width: width / 2 - 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { height: 2, width: 0 },
        elevation: 3,
      },
      sportImage: {
        width: '100%',
        height: height / 6,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      },
      sportTitle: {
        margin: 5,
        fontWeight: 'bold',
        color: '#000',
      },

 })

export default eventosVariados;