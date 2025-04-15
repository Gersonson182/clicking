import React, { useEffect, useState } from 'react';
import {Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


const BotonSalir = ({ idEvento, token, onSalirDelEvento }) => {
    
    const navigation = useNavigation();

    const SalirEvento = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/clk/participantes/salir/${idEvento}`,
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );

            console.log('Respuesta:', response.data);
            Alert.alert("Éxito", "Te has salido del evento exitosamente.");
            onSalirDelEvento();
            navigation.navigate('Home');
        } catch (error) {
            let mensajeError = "No se pudo salir del evento.";
            if (error.response) {
                mensajeError = error.response.data.error || "No se pudo salir del evento.";
            } else if (error.message) {
                mensajeError = "Problema de red o error en la solicitud.";
            }
            console.error('Error al salir del evento:', mensajeError);
            Alert.alert("Error", mensajeError);
        }
    };
      

return (
<TouchableOpacity style={styles.salirButton} onPress={SalirEvento}>
        <Text style={styles.participateButtonText}>Salir Evento</Text>
      </TouchableOpacity>

)
}

const styles = StyleSheet.create({
    salirButton: {
    backgroundColor: '#a2282a',
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

export default BotonSalir;