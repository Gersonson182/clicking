import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const PerfilAmigos = ({ route,navigation }) => {
  const { idUsuario } = route.params;
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {

        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('Token no disponible. Por favor, inicia sesión.');
        }

        const config = {
            headers: {
                'x-auth-token': token
            }
        };
        

        const response = await axios.get(`http://localhost:8080/clk/user/usuario/${idUsuario}`, config);
        if (response.data && response.data.usuarios && response.data.usuarios.length > 0) {
          setUsuario(response.data.usuarios[0]);
        } else {
          throw new Error('Usuario no encontrado');
        }
      } catch (error) {
        setError(error.message || 'Error al cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuario();
  }, [idUsuario]);

   
  const seguirUsuario = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('Token no disponible. Por favor, inicia sesión.');
      }

      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const data = {
        followingId: idUsuario
      };

      const response = await axios.post('http://localhost:8080/clk/follow/follower', data, config);

      // Muestra un mensaje de éxito y luego navega al inicio
      Alert.alert(
        "Éxito",
        "Ahora sigues a este usuario",
        [
          { 
            text: "OK", 
            onPress: () => navigation.navigate('Home') // Asegúrate de que 'Home' es el nombre de tu ruta de inicio
          }
        ]
      );

    } catch (error) {
      console.error(error);
      // Muestra un mensaje de error
      Alert.alert(
        "Error",
        "No se pudo seguir al usuario. Por favor, inténtalo de nuevo."
      );
    }
  };
  

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text>Ha ocurrido un error: {error}</Text></View>;
  }

  return (
    
    <View style={styles.container}>
      {/* Contenedor del Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={require('../img/baner.png')}
          style={styles.bannerImage}
        />
      </View>
  
      {usuario && (
        <>
          {/* Contenedor del Perfil */}
          <View style={styles.profileContainer}>
            <Image
              source={require('../img/perfil.png')} // Cambia esto por la imagen real del usuario si está disponible
              style={styles.profileImage}
            />
            <Text style={styles.nameText}>Nombre: {usuario.nombre}</Text>
            <Text style={styles.detailText}>Edad: {usuario.edad}</Text>
            <Text style={styles.detailText}>Genero: {usuario.genero}</Text>
            {/* Otros detalles del usuario */}
          </View>
  
          {/* Botón Seguir */}
          <TouchableOpacity style={styles.followButton} onPress={seguirUsuario}>
            <Text style={styles.followButtonText}>Seguir</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
      }
  
    
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#FFFFFF',
      padding: 16, // Añade un poco de padding si es necesario
    },
    bannerContainer: {
      flexDirection: 'row', // Esto hará que la imagen del banner y la del perfil estén en la misma fila
      alignItems: 'center', // Alineará verticalmente la imagen del perfil con el banner
      justifyContent: 'flex-start', // Esto alineará la imagen del perfil hacia el inicio de la fila, es decir, a la izquierda
      width: '100%', // El contenedor del banner ocupará el ancho completo
      height: 180, // Altura fija del banner, ajústala según tu diseño
      backgroundColor: '#F0F0F0', // Color de fondo del contenedor del banner
      marginTop: 50, // Espacio superior
      paddingHorizontal: 16, 
    },
    bannerImage: {
      width: 400, // Esto hará que la imagen del banner ocupe el 85% del ancho del contenedor
      height: 190, // La imagen del banner ocupará el 100% de la altura del contenedor
      position: 'absolute', // Posición absoluta para que la imagen de perfil se superponga
      top: 0, 
  },
    profileContainer: {
        backgroundColor: '#FFFFFF', // Fondo blanco para resaltar el perfil
        borderRadius: 10, // Bordes redondeados
        padding: 20, // Padding para dar espacio alrededor del contenido
        marginTop: -60, // Mueve el contenedor hacia arriba para superponerse sobre el banner
        alignItems: 'center', // Centra los elementos horizontalmente
        shadowColor: '#000', // Sombra para dar profundidad
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4, // Elevación para Android
        width: '90%', 
      
    },
    profileImage: {
      width: 120, // Ancho de la imagen de perfil
      height: 120, // Altura de la imagen de perfil
      borderRadius: 60, // Hará que la imagen de perfil sea circular
      borderWidth: 3,
      marginBottom: -10,
      marginLeft: -30,
      borderColor: '#000000',
    // Posición absoluta para que la imagen de perfil se superponga sobre el banner
      left: 10, // Distancia desde el inicio del contenedor del banner
      top: -70,

      
    },
    detailsContainer: {
      alignItems: 'center',
      alignItems: 'flex-start', // Alinear a la izquierda
      width: '100%', // Usar todo el ancho disponible
      paddingHorizontal: 10,
      marginTop: 20
      
    },
    nameText: {
      fontWeight: 'bold', 
      marginVertical: 10, 
      fontSize: 18
    },
    eventText: {
      fontSize: 18, // Ajusta el tamaño de la fuente según necesidad
      textAlign: 'center', // Alinea el texto al centro
      marginVertical: 2, // Ajusta el espacio entre líneas de eventos
    },
    followButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 40,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#00FF00', // Un verde brillante para el borde
      backgroundColor: '#FFFFFF', // Fondo blanco para el botón
    },
    followButtonText: {
      fontWeight: 'bold',
      fontSize: 18,
      color: '#000000', // Un verde brillante para el texto
    },
  });
  
  export default PerfilAmigos;