import React, { useEffect, useState } from 'react';
import {Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';



const BotonParticipar = ({idEvento, token, onParticiparEnEvento}) => {

    const participarEnEvento = async () => {
        try {
          const response = await axios.post(
            `http://localhost:8080/clk/participantes/${idEvento}`,
            {}, // Cuerpo de la solicitud, si es necesario
            {
              headers: {
                'x-auth-token': token, // Asegúrate de que el token es pasado correctamente
              },
            }
          );
    
          console.log('Respuesta:', response.data);
          Alert.alert("Éxito", "Te has unido al evento exitosamente.");
          onParticiparEnEvento(); 
        } catch (error) {
            if (error.response) {
              // Utiliza el mensaje de error del servidor si está disponible
              console.error('Error al unirse al evento:', error.response.data.error);
              Alert.alert("Error", error.response.data.error || "No se pudo unirse al evento.");
            } else {
              // Manejar otros tipos de errores (ej. problemas de red)
              console.error('Error al unirse al evento:', error.message);
              Alert.alert("Error", "No se pudo unirse al evento debido a un problema de red.");
            }
          }
        };

return (
<TouchableOpacity style={styles.participateButton} onPress={participarEnEvento}>
        <Text style={styles.participateButtonText}>Participar</Text>
      </TouchableOpacity>

)
}

const styles = StyleSheet.create({
participateButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participateButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default BotonParticipar;