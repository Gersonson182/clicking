import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import axios from 'axios';

const RegistrationForm = ({navigation}) => {

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    edad: '',
    genero: '',
    img: '0'
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Limpiar errores
    if (!!errors[field]) setErrors({ ...errors, [field]: null });
  };

 
const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    // Validar nombre
    if (formData.nombre.trim() === '') {
      isValid = false;
      newErrors.nombre = 'El nombre no puede estar vacío';
    }

    // Validar correo
    if (!isValidEmail(formData.correo)) {
      isValid = false;
      newErrors.correo = 'El correo no es válido';
    }

    // Validar contraseña
    if (formData.password.length < 6) {
      isValid = false;
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar edad
    if (!formData.edad || isNaN(formData.edad) || parseInt(formData.edad) <= 0) {
      isValid = false;
      newErrors.edad = 'Ingrese una edad válida';
    }

    // Validar género
    if (!formData.genero) {
      isValid = false;
      newErrors.genero = 'Seleccione un género';
    }

    setErrors(newErrors);
    return isValid;
  };

  const [selectedGender, setSelectedGender] = useState('');



  // Cuando seleccionas un género, actualizas el formData
  const handleSelectGender = (gender) => {
    setSelectedGender(gender);
    setFormData({ ...formData, genero: gender });
  };


  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Aquí asegúrate de que formData incluya el género actualizado
        const payload = {
          ...formData,
          genero: selectedGender, 
        };
  
        const response = await axios.post('http://localhost:8080/clk/user', payload);
        console.log(response.data);
        Alert.alert("Éxito", "Registro completado con éxito.");
        // Navegación o cualquier otra lógica de post-registro
        navigation.navigate('Login');
      } catch (error) {

        if (error.response) {
          // La respuesta del servidor fue un código de estado fuera del rango 2xx
          const errorMessage = error.response.data.error || 'Ocurrió un error inesperado.';
          Alert.alert('Error', errorMessage);
        } else if (error.request) {
          // La solicitud fue hecha pero no hubo respuesta del servidor
          Alert.alert('Error', 'La solicitud fue hecha pero no hubo respuesta del servidor.');
        } else {
          // Algo más causó el error
          Alert.alert('Error', 'Ocurrió un error al hacer la solicitud: ' + error.message);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        onChangeText={(text) => handleInputChange('nombre', text)}
        />
        {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
  
      <TextInput
        style={styles.input}
        placeholder="Correo"
        keyboardType="email-address"
        onChangeText={(text) => handleInputChange('correo', text)}
      />
       {errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => handleInputChange('password', text)}
      />
       {errors.contraseña && <Text style={styles.errorText}>{errors.contraseña}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Edad"
        keyboardType="numeric"
        onChangeText={(text) => handleInputChange('edad', text)}
      />
    {errors.edad && <Text style={styles.errorText}>{errors.edad}</Text>}

    <View style={styles.inputGroup}>
  {['Masculino', 'Femenino', 'Otro'].map((gender) => (
    <TouchableOpacity
      key={gender}
      style={styles.radioButtonContainer}
      onPress={() => handleSelectGender(gender)}
    >
      <View style={styles.radioButton}>
        {selectedGender === gender && <View style={styles.radioButtonSelected} />}
      </View>
      <Text style={styles.radioButtonText}>{gender}</Text>
    </TouchableOpacity>
  ))}
</View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', 
  },
  input: {
    backgroundColor: '#ffffff', 
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd', 
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#5D3FD3', 
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  radioButtonText: {
    marginLeft: 5,
  }
});

export default RegistrationForm;
