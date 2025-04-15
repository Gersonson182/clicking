
import React, {useContext, useEffect, useState } from 'react';
import { AuthContext } from '../componentes/AuthContext';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Alert,ActivityIndicator,SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FriendsList from '../componentes/ListadeAmigos';
import TodoEventos from '../componentes/TodosEventos';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';


const { width, height } = Dimensions.get('window');
const dynamicStyles = {
  navTitle: {
    fontSize: width < 350 ? 18 : 20, // Fuente más pequeña para pantallas estrechas
  },
  searchBar: {
    width: width > 400 ? '95%' : '90%', // Ancho más grande para pantallas anchas
    borderRadius: height > 800 ? 25 : 20, // Bordes más redondeados para pantallas altas
  },
  favoriteCard: {
    width: width / 2 - 30, // Hace la tarjeta más pequeña reduciendo el ancho
    elevation: Platform.OS === 'android' ? 10 : 0, // Aumenta la elevación en Android para una sombra más prominente
  },

};



const HomeScreen = () => {

  const navigation = useNavigation();



  const [favoritos, setFavoritos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [token, setToken] = useState(null);

  useEffect(() => {
    
    const cargarFavoritos = async () => {
      setIsLoading(true);
      try {
        // Obtén el token del almacenamiento local
        const token = await AsyncStorage.getItem('jwtToken');
        
        // Verifica si el token existe
        if (!token) {
          throw new Error('Token no disponible. Por favor, inicia sesión.');
        }
        
        // Configura los headers de la solicitud para incluir el token en 'x-auth-token'
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
  
        // Realiza la solicitud al backend con el token en el encabezado correcto
        const response = await axios.get('http://localhost:8080/clk/event/EventosFavoritos', config);
        console.log('Respuesta del servidor:', response.data);
  
        // Verifica si la respuesta contiene los datos esperados
        if (response.data && Array.isArray(response.data.eventos)) {
          setFavoritos(response.data.eventos);
       
        } else {
          // Si no hay eventos, se establece un array vacío para evitar errores
          setFavoritos([]);
          console.log('no hay eventos')
        }
      } catch (error) {
        // Maneja los errores de la solicitud y muestra una alerta adecuada
        console.error('Error al cargar los favorito:', error);
        Alert.alert("Error", "No se pudieron cargar los eventos favoritos.");
      } finally {
        // Desactiva el estado de carga independientemente de si hubo un error
        setIsLoading(false);
      }
    };
  
    cargarFavoritos();
  }, []);


  useEffect(() => {
    const obtenerDatos = async () => {
        const tokenObtenido = await AsyncStorage.getItem('jwtToken');
        setToken(tokenObtenido);
        // Aquí también podrías obtener el ID del usuario si es necesario
    };

    obtenerDatos();
}, []);



  useEffect(() => {
    let socket;
    const initializeSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
          socket = io('http://localhost:8080', {
            query: { token }
          });
  
          // Escuchar el evento 'eventoParticipado'
          socket.on('eventoParticipado', (idEventoParticipado) => {
            setFavoritos(eventosActuales => eventosActuales.filter(evento => evento.id_evento !== idEventoParticipado));
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
    
  
    initializeSocket();
  
    return () => {
      console.log('Desconectando de Socket.IO');
      if (socket) socket.disconnect();
    };
  }, []);
  
  const imagenesDeportes = {
    1: require('../img/tenis2.png'),
    2: require('../img/padel.png'),
    3: require('../img/maraton.png'),
    4: require('../img/trekking.png'),
    default: require('../img/deportes.png'), // Imagen por defecto
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.contentContainer}>
    <ScrollView style={styles.scrollView}>
      {/* Barra de navegación */}
  <View style={[styles.navBar, dynamicStyles.navBar]}>
  <Text style={[styles.navTitle, dynamicStyles.navTitle]}>Clicking</Text>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
   
    <TouchableOpacity onPress={() => navigation.navigate('EventScreen')}>
          <Text style={{ marginRight: 10 }}>Mis eventos</Text>
        </TouchableOpacity>
  </View>
</View>
      
      {/* Barra de búsqueda */}
  <View style={styles.searchBarContainer}>
  <TextInput
    style={styles.searchBar}
    placeholder="Buscar Eventos"
    // ... otros props de TextInput si son necesarios
  />
   <TouchableOpacity>
    <Icon name="search" size={20} color="#000" style={styles.searchIcon} />
  </TouchableOpacity>
</View>


      
      {/* Eventos favoritos  si es que los tiene*/}
      {/* Indicador de carga */}
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

{/* Renderizado condicional para la sección de favoritos */}
{!isLoading && favoritos.length > 0 && (
  <View>
    <Text style={styles.sectionTitle}>Eventos Favoritos</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {favoritos.map((favorito) => {
        // Selecciona la imagen basada en el ID del deporte del evento favorito
        const imagenDeporte = imagenesDeportes[favorito.id_deporte] || imagenesDeportes['default'];
       

        return (
          <TouchableOpacity
            key={favorito.id_evento.toString()}
            onPress={() => navigation.navigate('VerEventosHome', { id: favorito.id_evento})}
            style={[styles.favoriteCard, dynamicStyles.favoriteCard]}
          >
            <Image source={imagenDeporte} style={styles.favoriteImage} />
            <Text style={styles.favoriteTitle}>{favorito.nombre_evento}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
)}


{/* Mensaje si no hay favoritos */}
{!isLoading && favoritos.length === 0 && (
  <Text style={styles.sectionTitle}>No tienes eventos favoritos seleccionados.</Text>
)}
      
      {/* Sección de amigos */}
      <FriendsList />
  
      {/* Eventos deportivos */}
      
      <TodoEventos />
      </ScrollView>
      </View>
      {/* Barra de navegación inferior */}
      <View style={[styles.bottomNav, dynamicStyles.bottomNav]}>
        <TouchableOpacity>
          <Icon name="home" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PostsList')}>
        <Icon name="book" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PerfilPersonal')}>
            <Icon name="user" size={24} />
        </TouchableOpacity>
      </View>
      </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // o el color de fondo que prefieras
  },
  contentContainer: {
    flex: 1, // Toma toda la pantalla menos el bottomNav
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  navTitle: {
    fontSize: width < 350 ? 18 : 20, // Tamaño de fuente adaptable
    fontWeight: 'bold',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchBar: {
    flex: 1, // Usa todo el espacio disponible excepto el ícono de la lupa
    paddingLeft: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    
  },
  searchIcon: {
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  favoriteCard: {
    width: width / 2 - 30, // Este valor debe coincidir con el de dynamicStyles si usas ambos
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000', // Color de la sombra para iOS
    shadowOpacity: 0.3, // Aumenta la opacidad de la sombra para iOS
    shadowRadius: 6, // Aumenta el radio de la sombra para iOS
    shadowOffset: { width: 0, height: 4 },
    // Añade sombras y otros estilos según sea necesario
  },
  favoriteImage: {
    width: '100%',
    height: height / 7, 
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  favoriteTitle: {
    margin: 5,
    fontWeight: 'bold',
  },
  // Añadir estilos para las demás secciones...
 
    bottomNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
    
  },
  
  
  
  friendName: {
    marginTop: 5,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
 
  bottomNavButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavIcon: {
    color: '#fff',
  },


  
});

export default HomeScreen;