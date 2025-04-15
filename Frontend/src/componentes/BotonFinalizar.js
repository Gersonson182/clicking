import React, { useEffect, useState } from 'react';
import {Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Asegúrate de importar AsyncStorage

const BotonFinalizarEvento = ({idEvento}) => {
    const FinalizarEvento = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) {
                Alert.alert("Error", "No se encontró token de autenticación.");
                return;
            }

            // Configuración de headers para la solicitud
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };

            const response = await axios.put(
                `http://localhost:8080/clk/event/finalizar/${idEvento}`,
                {}, // Un objeto vacío si no estás enviando datos en el cuerpo de la solicitud
                config
            );

            console.log('Respuesta:', response.data);
            Alert.alert("Éxito", "Has Finalizado el evento exitosamente.");
        } catch (error) {
            let mensajeError = "No se pudo finalizar el evento.";
            if (error.response) {
                mensajeError = error.response.data.error || "Error al finalizar el evento.";
            } else if (error.message) {
                mensajeError = "Problema de red o error en la solicitud.";
            }
            console.error('Error al finalizar el evento:', mensajeError);
            Alert.alert("Error", mensajeError);
        }
    };

    return (
        <TouchableOpacity style={styles.participateButton} onPress={FinalizarEvento}>
            <Text style={styles.participateButtonText}>Finalizar Evento</Text>
        </TouchableOpacity>
    );
};

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

export default BotonFinalizarEvento;