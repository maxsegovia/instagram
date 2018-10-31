import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Spinner = ({ size }) => {
  const { spinner } = styles;

  return (
    <ActivityIndicator style={spinner} size="large" color="black" />
  );
};

const styles = {
  spinner: {
      justifyContent: 'center',
      alignItems: 'center',
  }
};

export { Spinner };
