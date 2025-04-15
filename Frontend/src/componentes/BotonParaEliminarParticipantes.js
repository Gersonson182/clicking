import React, { useEffect, useState } from 'react';
import {Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

const BotonEliminar = ({idEvento, idUsuario, token}) => {

    console.log('Este es el id Evento',idEvento, 'Este es el id usuario',idUsuario, 'Este es el Token',token);

    const EliminarParticipante = async () => {
        try {
          const response = await axios.delete(
            `http://localhost:8080/clk/participantes/expulsar/${idEvento}/${idUsuario}`,
            {
              headers: {
                'x-auth-token': token, // Asegúrate de que el token es pasado correctamente
              },
            }
          );
    
          console.log('Respuesta:', response.data);
          Alert.alert("Éxito", "Has eliminado participante");
        
        } catch (error) {
            let mensajeError = "Error al eliminar participante.";
            if (error.response) {
                mensajeError = `Request failed with status code ${error.response.status}`;
            } else if (error.message) {
                mensajeError = error.message;
            }
            console.error('Error al eliminar participante:', mensajeError);
            Alert.alert("Error", mensajeError);
        }
    };

return (
<TouchableOpacity style={styles.participateButton} onPress={EliminarParticipante}>
        <Text style={styles.participateButtonText}>Eliminar Participante</Text>
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

export default BotonEliminar;