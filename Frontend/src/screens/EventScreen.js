import React from 'react';
import { View, StyleSheet, SafeAreaView , ScrollView, TouchableOpacity} from 'react-native';
import EventList from '../componentes/ListadeEventos'; // Asegúrate de que la ruta del import sea correcta
import CreateEvent from '../componentes/CreaTuEvento'; // Asegúrate de que la ruta del import sea correcta
import UserEvenList from '../componentes/UserEventList';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';



const EventScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <ScrollView style={styles.scrollView}>
          <UserEvenList />
          <EventList />
          <CreateEvent />
        </ScrollView>
      </View>
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Icon name="home" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
        <Icon name="book" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PerfilPersonal')}>
            <Icon name="user" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1, // El contenido toma todo el espacio excepto la barra de navegación
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  // Puedes mover los estilos comunes aquí si es necesario
});

export default EventScreen;

