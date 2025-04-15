import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListaAmigosUser = ({ route }) => {
  const { idUsuario } = route.params;
  const [amigos, setAmigos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAmigos = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('Token no disponible. Por favor, inicia sesión.');
        }

        const config = { headers: { 'x-auth-token': token } };
        const response = await axios.get(`http://localhost:8080/clk/follow/buscarAmigos/${idUsuario}`, config);

        if (response.data && response.data.amigos) {
          setAmigos(response.data.amigos);
        } else {
          setError('Aún no tienes amigos');
        }
      } catch (error) {
        setError(error.message || 'Error al cargar la lista de amigos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAmigos();
  }, [idUsuario]);

  const renderItem = ({ item }) => (
    <View style={styles.amigoItem}>
      <Image source={require('../img/perfil.png')} style={styles.avatar} />
      <Text style={styles.nombre}>{item.nombre}</Text>
    </View>
  );

  if (isLoading) {
    return <View style={styles.container}><Text>Cargando amigos...</Text></View>;
  }

  if (error) {
    return <View style={styles.container}><Text>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={amigos}
        renderItem={renderItem}
        keyExtractor={item => item.id_usuario.toString()}
        ListEmptyComponent={<Text>No tienes amigos aún.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amigoItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  nombre: {
    fontSize: 16,
  },
});

export default ListaAmigosUser;


