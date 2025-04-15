import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de amigo"
          underlineColorAndroid="transparent"
        />
        <Icon style={styles.searchIcon} name="search" size={20} color="#000"/>
      </View>

      <TouchableOpacity style={styles.optionButton}>
        <Icon name="address-book" size={20} color="#000" />
        <Text style={styles.optionText}>Ver Lista de Amigos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton}>
        <Icon name="users" size={20} color="#3b5998" />
        <Text style={styles.optionText}>Buscar Amigos</Text>
      </TouchableOpacity>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  searchIcon: {
    padding: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default App;
