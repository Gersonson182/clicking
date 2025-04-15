import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CrearPost = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: ''
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const crearPost = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const requestData = {
        ...formData
      };

      const response = await axios.post('http://localhost:8080/clk/posts/', requestData, {
        headers: {
          'x-auth-token': token
        }
      });

      setFormData({
        titulo: '',
        contenido: ''
      });

      Alert.alert("Éxito", "Post creado correctamente", [{ text: "OK" }]);
    } catch (error) {
      console.error('Error al crear el post:', error);
      Alert.alert("Error", "No se pudo crear el post");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Crear Post</Text>
      <TextInput
        placeholder="Título"
        style={styles.input}
        onChangeText={(text) => handleInputChange('titulo', text)}
        value={formData.titulo}
      />
      <TextInput
        placeholder="Contenido"
        style={styles.textArea}
        multiline={true}
        numberOfLines={4}
        onChangeText={(text) => handleInputChange('contenido', text)}
        value={formData.contenido}
      />
      <TouchableOpacity style={styles.createButton} onPress={crearPost}>
        <Text style={styles.createButtonText}>Clicking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    backgroundColor: '#fff',
    height: 100,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  createButton: {
    backgroundColor: '#5cb85c',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CrearPost;
