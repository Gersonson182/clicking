import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import io from 'socket.io-client';
import BotonEliminar from './BotonParaEliminarParticipantes';


const contarParticipantesID = ({ idEvento }) => {
  const [participantes, setParticipantes] = useState([]);
  const [esCreador, setEsCreador] = useState(false);
  const [token, setToken] = useState(null); 

  useEffect(() => {
      let socket;

      const obtenerToken = async () => {
          const tokenObtenido = await AsyncStorage.getItem('jwtToken');
          if (!tokenObtenido) {
              throw new Error('Token no disponible. Por favor, inicia sesión.');
          }
          return tokenObtenido;
      };

      const fetchParticipantes = async (token) => {
          try {
              const config = {
                  headers: {
                      'x-auth-token': token
                  }
              };
              const response = await axios.get(`http://localhost:8080/clk/participantes/eventoPorIDevento/${idEvento}/participantes/contar`, config);
              setParticipantes(response.data.participantes || []);
          } catch (error) {
              console.error('Error al obtener los participantes:', error);
          }
      };

      const verificarCreador = async (token) => {
          try {
              const config = {
                  headers: {
                      'x-auth-token': token
                  }
              };
        
              const response = await axios.get(`http://localhost:8080/clk/event/creador/${idEvento}`, config);
              setEsCreador(response.data.esCreador);
          } catch (error) {
              console.error('Error al verificar el creador:', error);
          }
      };
    
      const setupSocketConnection = (token) => {
          socket = io('http://localhost:8080', {
              query: { token }
          });

          socket.on('participantesActualizar', (data) => {
              if (data.id_evento === idEvento) {
                  fetchParticipantes(token);
              }
          });
      };

      const inicializar = async () => {
          try {
              const tokenObtenido = await obtenerToken();
              setToken(tokenObtenido);
              fetchParticipantes(tokenObtenido);
              verificarCreador(tokenObtenido);
              setupSocketConnection(tokenObtenido);
          } catch (error) {
              console.error('Error al inicializar:', error);
          }
      };

      if (idEvento) {
          inicializar();
      }

      return () => {
          if (socket) {
              socket.off('participantesActualizar');
              socket.disconnect();
          }
      };
  }, [idEvento]);
  
  return (
      <View style={styles.participantsContainer}>
          <Text style={styles.participantsTitle}>Participantes ({participantes.length})</Text>
          <View style={styles.participantsList}>
              {participantes.map(participante => (
                  <View key={participante.id} style={styles.participantItem}>
                      <Icon name="user" size={30} color="#000" />
                      <Text style={styles.participantName}>{participante.nombre}</Text>
                      {esCreador && <BotonEliminar idEvento={idEvento} idUsuario={participante.id} token={token} />}
                  </View>
              ))}
          </View>
      </View>
  );
};
    
const styles = StyleSheet.create({

participantsContainer: {
    padding: 20,
  },
  participantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Centrar los íconos
    alignItems: 'center', // Alineación vertical
    marginVertical: 10, // Espacio vertical
  },
  participantIcon: {
    // Estilo para cada ícono
    margin: 5, // Espacio alrededor de cada ícono
    borderWidth: 1, // Ancho del borde
    borderColor: 'black', // Color del borde
    borderRadius: 25, // Radio del borde para hacerlo circular
    padding: 10, // Espaciado interno para que el ícono no toque el borde
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  participantName: {
    marginLeft: 10,
    // otros estilos para el texto si es necesario
  },
})
export default contarParticipantesID;