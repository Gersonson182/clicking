import {useState, useEffect, useContext} from 'react';
import { ScrollView, Text, TextInput, View, TouchableOpacity, StyleSheet, Alert, RadioButton } from 'react-native';
// Importar otros componentes necesarios...

const ModificarPerfilPersonal = ({ route }) => {

    const { idUsuario } = route.params;
    console.log("Renderizando ModificarPerfilPersonal", { idUsuario });

    const [formData, setFormData] = useState({
        nombre: '',
        edad: '',
        genero: '',
        img: '0'
      });
    
      const [errors, setErrors] = useState({});
    
      const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (!!errors[field]) setErrors({ ...errors, [field]: null });
      };
    
      const validateForm = () => {
        let isValid = true;
        let newErrors = {};
    
        // Validaciones aquí...
    
        setErrors(newErrors);
        return isValid;
      };
    
      const [selectedGender, setSelectedGender] = useState('');
    
      const handleSelectGender = (gender) => {
        setSelectedGender(gender);
        setFormData({ ...formData, genero: gender });
      };
    
      const handleSubmit = async () => {
        // Lógica para manejar el envío del formulario...
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

      <TextInput
        placeholder="Descripción"
        style={styles.textArea}
        multiline={true}
        numberOfLines={4}
        onChangeText={(text) => handleInputChange('descripcion', text)}
        value={formData.descripcion}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Modificar</Text>
      </TouchableOpacity>
    </View>

        

        
            
    );
};

// Añade estilos adicionales si es necesario
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
        backgroundColor: '#4e9f3d', // Color verde para el botón
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
      },
      buttonText: {
        color: '#ffffff', // Texto blanco para el botón
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
});

export default ModificarPerfilPersonal;