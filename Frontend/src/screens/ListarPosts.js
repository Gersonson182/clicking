import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PostsList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          Alert.alert("Error", "No se ha podido obtener el token de autenticación");
          return;
        }
        const response = await axios.get('http://localhost:8080/clk/posts/', {
          headers: {
            'x-auth-token': token
          }
        });
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error al obtener posts:', error);
        Alert.alert("Error", "No se pudieron obtener los posts");
      }
    };

    fetchPosts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.titulo}</Text>
      <Text style={styles.postContent}>{item.contenido.substring(0, 100)}...</Text>
      <Text style={styles.postAuthor}>Publicado por: {item.nombreUsuario}</Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text>No hay posts disponibles.</Text>
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => item.id_post.toString()}
      ListEmptyComponent={renderEmptyComponent}
    />
  );
};

const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: 'center',
        marginTop: 20,
      },
  postContainer: {
    backgroundColor: '#ffffff', // Fondo blanco para cada post
    padding: 15, // Espaciado interno
    borderRadius: 10, // Bordes redondeados
    marginVertical: 8, // Margen vertical entre posts
    marginHorizontal: 16, // Margen horizontal
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5, // Espacio debajo del título
  },
  postContent: {
    fontSize: 14,
    color: '#333333', // Color del texto para el contenido
  },
  postAuthor: {
    fontSize: 12,
    color: '#666666', // Color del texto para el autor
    marginTop: 10, // Espacio arriba del nombre del autor
  },
});

export default PostsList;
