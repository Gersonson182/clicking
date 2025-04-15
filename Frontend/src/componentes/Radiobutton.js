import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const RadioButton = ({ selected, onPress, iconName, label }) => (
  <TouchableOpacity style={styles.radioButtonContainer} onPress={onPress}>
    <Icon
      name={selected ? 'dot-circle-o' : 'circle-o'}
      size={24}
      color={selected ? '#0000FF' : '#808080'}
    />
    <Text style={styles.radioButtonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default RadioButton;