import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView,Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CreateEvent = () => {

  const initialState = {
    nombre: '',
    idDeporte: '',
    descripcion: '',
    direccion: '',
    img: '',
    participantes: 1,
    fechaInicio: new Date(),
    horaInicio: new Date(),
};

const [formData, setFormData] = useState(initialState);



  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || formData.fechaInicio;
    setShowDatePicker(Platform.OS === 'ios');
    handleInputChange('fechaInicio', currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || formData.horaInicio;
    setShowTimePicker(Platform.OS === 'ios');
    handleInputChange('horaInicio', currentTime);
  };

  const incrementParticipants = () => {
    handleInputChange('participantes', formData.participantes < 10 ? formData.participantes + 1 : formData.participantes);
  };

  const decrementParticipants = () => {
    handleInputChange('participantes', formData.participantes > 1 ? formData.participantes - 1 : formData.participantes);
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };
  
 

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  

  // Función para obtener el token JWT (implementación necesaria)
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      return token;
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return null;
    }
  };

  // Función para crear el evento
  const crearEvento = async () => {

    const token = await getToken();
    const fecha_inicio = formatDate(formData.fechaInicio);
    const hora_inicio = formatTime(formData.horaInicio); // Cambiado de 'hora_inicio' a 'hora'
    console.log("Hora formateada que se enviará:", formatTime(formData.horaInicio));
  
    const requestData = {
      nombre: formData.nombre,
      id_deporte: formData.idDeporte, // Cambiado de 'idDeporte' a 'id_deporte'
      descripcion: formData.descripcion,
      direccion: formData.direccion,
      img: formData.img,
      participantes: formData.participantes,
      fecha_inicio, // Asegúrate de que esto es una fecha en el formato 'YYYY-MM-DD'
      hora_inicio, // Asegúrate de que esto es una hora en el formato 'HH:MM'
    };
  
    console.log("Enviando solicitud con los siguientes datos:", requestData);

    
  
    try {
      const response = await axios.post('http://localhost:8080/clk/event', requestData, {
        headers: {
          'x-auth-token': token
        }
      });
  
      console.log("Respuesta recibida:", response.data);

      setFormData(initialState);

      Alert.alert(
          "Éxito",
          "Evento creado correctamente",
          [{ text: "OK" }]
      );

    
  
    } catch (error) {
      if (error.response) {
        console.error('Error en la respuesta del servidor:', error.response.data);
      } else if (error.request) {
        console.error('La solicitud fue hecha pero no se recibió respuesta:', error.request);
      } else {
        console.error('Error en la configuración de la solicitud:', error.message);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Crea tu evento</Text>
      <TextInput
        placeholder="Nombre"
        style={styles.input}
        onChangeText={(text) => handleInputChange('nombre', text)}
        value={formData.nombre}
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Deporte</Text>
        <RNPickerSelect
          onValueChange={(value) => handleInputChange('idDeporte', value)}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: 'Selecciona un deporte...',
            value: null,
          }}
          items={[
            { label: 'Tenis', value: '1' },
            { label: 'Padel', value: '2' },
            { label: 'Maraton', value: '3' },
            { label: 'Trekking', value: '4' },
            // más items...
          ]}
          value={formData.idDeporte}
        />
      </View>
      <View style={styles.dateTimePickerContainer}>
        <Text>Fecha de Evento</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <Text style={styles.datePickerText}>{formData.fechaInicio.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.fechaInicio}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        <Text>Hora del evento</Text>
        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timePickerButton}>
          <Text style={styles.timePickerText}>{formData.horaInicio.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={formData.horaInicio}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}
      </View>
      <View style={styles.participantsContainer}>
        <Text>Cantidad de participantes</Text>
        <TouchableOpacity onPress={decrementParticipants} style={styles.participantsButton}>
          <Text style={styles.participantsText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.participantsCount}>{formData.participantes}</Text>
        <TouchableOpacity onPress={incrementParticipants} style={styles.participantsButton}>
          <Text style={styles.participantsText}>+</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder="Descripción"
        style={styles.textArea}
        multiline={true}
        numberOfLines={4}
        onChangeText={(text) => handleInputChange('descripcion', text)}
        value={formData.descripcion}
      />
      <TextInput
        placeholder="Dirección"
        style={styles.input}
        onChangeText={(text) => handleInputChange('direccion', text)}
        value={formData.direccion}
      />
      <TextInput
        placeholder="Imagen"
        style={styles.input}
        onChangeText={(text) => handleInputChange('img', text)}
        value={formData.img}
      />
      <TouchableOpacity style={styles.createButton} onPress={crearEvento}>
        <Text style={styles.createButtonText}>Crear</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Estilos para CreateEvent
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f2f2f2', // Un fondo claro para el formulario
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600', // Algo menos pesado que 'bold'
      color: '#333', // Color oscuro para el título
      marginBottom: 25,
      textAlign: 'center',
    },
    input: {
      backgroundColor: '#fff', // Fondo blanco para los inputs
      height: 50,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ddd', // Un borde ligero
      marginBottom: 15,
      paddingHorizontal: 15,
      fontSize: 16,
      color: '#333', // Texto oscuro para mejor legibilidad
    },
    pickerContainer: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      color: '#333', // Igual que el texto del input
      marginBottom: 5,
      fontWeight: '500',
    },
    dateTimePickerContainer: {
      marginBottom: 20,
    },
    datePickerButton: {
      backgroundColor: '#fff', // Fondo blanco para el botón
      padding: 12,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ddd',
      marginBottom: 10,
    },
    timePickerButton: {
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ddd',
      marginBottom: 10,
    },
    datePickerText: {
      textAlign: 'center',
      fontSize: 16,
      color: '#333',
    },
    timePickerText: {
      textAlign: 'center',
      fontSize: 16,
      color: '#333',
    },
    participantsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 20,
    },
    participantsButton: {
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ddd',
      marginHorizontal: 10,
    },
    participantsText: {
      fontSize: 24, // Un poco más grande para los botones +/-
      color: '#333',
    },
    participantsCount: {
      fontSize: 16,
      color: '#333',
      paddingHorizontal: 15,
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
      backgroundColor: '#5cb85c', // Color verde para el botón de crear
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
  
  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      backgroundColor: '#fff',
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      color: '#333',
      paddingRight: 30, // para asegurar que el texto no se solape con el icono
      marginBottom: 15,
    },
    inputAndroid: {
      backgroundColor: '#fff',
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      color: '#333',
      paddingRight: 30, // para asegurar que el texto no se solape con el icono
      marginBottom: 15,
    },
  });
  
  

export default CreateEvent;

