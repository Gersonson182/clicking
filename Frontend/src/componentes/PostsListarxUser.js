import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListarPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:8080/clk/posts/getTodo', {
          headers: {
            'x-auth-token': token
          }
        });
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error al obtener posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.titulo}</Text>
      <Text style={styles.postContent}>{item.contenido}</Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text>No hay posts registrados aún.</Text>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => item.id_post.toString()}
      ListEmptyComponent={renderEmptyComponent}
      horizontal={true} // Cambio para hacer la lista horizontal
      showsHorizontalScrollIndicator={false} // Ocultar la barra de desplazamiento horizontal
    />
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.8, // Ancho de cada tarjeta
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 14,
    color: '#333333',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});

export default ListarPosts;

