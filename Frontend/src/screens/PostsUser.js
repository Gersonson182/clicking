import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import ListarPosts from '../componentes/PostsListarxUser'; // Asegúrate de que la ruta del import sea correcta
import CrearPost from '../componentes/PostsCrear'; // Asegúrate de que la ruta del import sea correcta
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const PostsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <ScrollView style={styles.scrollView}>
          <ListarPosts />
          <CrearPost />
        </ScrollView>
      </View>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Icon name="home" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('BookScreen')}>
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
    flex: 1,
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
});

export default PostsScreen;
