import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions  } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';


const { height } = Dimensions.get('window');

const FriendsList = () => {
  const navigation = useNavigation();
  const [amigos, setFriends] = useState([]);


  // Definición de la función fetchRandomFriends
  const fetchRandomFriends = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      const response = await axios.get('http://localhost:8080/clk/user', config);
      console.log(response.data.usuarios); // Imprime para verificar
      setFriends(response.data.usuarios);
    
    } catch (error) {
      console.error('Error al cargar amigos aleatorios:', error);
    }
  };


  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          const socket = io('http://localhost:8080', { query: { token } });

          socket.on('update', () => {
            fetchRandomFriends(); // Actualiza la lista de amigos cuando se recibe el evento
          });

        } else {
          console.error('Token no disponible');
          Alert.alert("Error", "No se ha podido obtener el token de autenticación");
        }
      } catch (error) {
        console.error('Error al inicializar Socket.IO:', error);
      }
    };

    initializeSocket();
    fetchRandomFriends(); // Carga inicial de amigos
  }, []);
  


  // Estilos (puedes definir tus propios estilos aquí)
  const styles = StyleSheet.create({
    friendsSection: {
        backgroundColor: '#fff', // Color de fondo para la sección
        padding: 10, // Espaciado interno para no pegar al borde de la pantalla
        borderRadius: 10, // Bordes redondeados para un look más suave
        shadowColor: '#000', // Sombra para dar profundidad
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { height: 3, width: 0 },
        elevation: 3, // Elevación para sombra en Android
        margin: 10, // Margen alrededor de la sección
      },
   
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10,
        color: '#333', // Color del texto para una mejor visibilidad
    },
    friendAvatar: {
        width: height < 600 ? 70 : 80, // Tamaño más pequeño para pantallas cortas
        height: height < 600 ? 70 : 80, // Tamaño más pequeño para pantallas cortas
        margin: 15, // Añade un margen para evitar el solapamiento
        justifyContent: 'center', // Centra el contenido en el contenedor flex
        alignItems: 'center', // Centra el contenido en el eje transversal
        borderRadius: 40,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { height: 2, width: 0 },
        elevation: 2,
    },
    friendImage: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
    },
    friendName: {
        marginTop: 5, // Espacio entre la imagen y el nombre
        fontSize: 14, // Tamaño de letra adecuado para nombres
        color: '#555', // Color de letra para una buena legibilidad
        textAlign: 'center', // Centra el texto debajo de la imagen
      },
  });

  // Lógica para cargar amigos desde el servidor (ver paso 2)

  return (
    <View style={styles.friendsSection}>
      <Text style={styles.sectionTitle}>Personas que conozcas</Text>
      <ScrollView horizontal>
      {Array.isArray(amigos) && amigos.map((amigo) => (
          <TouchableOpacity 
            key={amigo.id_usuario.toString()} 
            style={styles.friendAvatar}
            onPress={() => navigation.navigate('PerfilScreen', { idUsuario: amigo.id_usuario })} // Aquí cambia 'OtherScreen' por el nombre de tu pantalla y pasa el id
          >
            <Text style={styles.friendName}>{amigo.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default FriendsList;
