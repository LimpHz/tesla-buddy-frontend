import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export function StyledTextInput(props: TextInputProps) {
  return <TextInput style={[styles.input, props.style]} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    color: '#ffffff',
    borderColor: '#ffffff',
    maxWidth: 200
  },
});