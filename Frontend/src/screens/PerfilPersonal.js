
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../componentes/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';



const PerfilScreenPersonal = () => {
    const navigation = useNavigation();
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    

  const { signOut } = useContext(AuthContext);
  const handleLogout = async () => {
    try {
      await signOut();
      console.log('Cerrando la sesion en el HomeScreen')
      Alert.alert("Sesión Cerrada", "Has cerrado sesión con éxito.");
    } catch (error) {
      console.error('Error al cerrar la sesión:', error);
    }
  };

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

                const response = await axios.get('http://localhost:8080/clk/user/perfil', config);
                console.log('Respuesta del servidor:', response.data);

                if (response.data && response.data.usuarios && response.data.usuarios.length > 0) {
                    setUsuario(response.data.usuarios[0]);
                    console.log('Datos del usuario:', response.data.usuarios[0]);
                } else {
                    throw new Error('Datos del usuario no encontrados');
                }
            } catch (error) {
                console.error('Error al cargar el perfil:', error);
                setError(error.message || 'Error al cargar el perfil');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsuario();
    }, []);

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
            <Text style={styles.detailText}>Correo: {usuario.correo}</Text>
            <Text style={styles.detailText}>ID: {usuario.id_usuario}</Text>
            {/* Otros detalles del usuario */}
          </View>

            {/* Botón para Modificar Perfil */}
        <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate('ModificarPerf', { idUsuario: usuario.id_usuario })}>
            <Text style={styles.buttonText}>Modificar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ListaAmigosUser', {idUsuario: usuario.id_usuario})}>
            <Text style={styles.buttonText}>Amigos</Text>
        </TouchableOpacity>
        

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PostCrear')}>
            <Text style={styles.buttonText}>Crear tu post Clicking!</Text>
        </TouchableOpacity>

        {/* Botón para Cerrar Sesión */}
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
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
      button: {
        backgroundColor: '#4e9f3d', // Un color verde oscuro para el botón
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default PerfilScreenPersonal;
