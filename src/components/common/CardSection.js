import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
  const { containerStyle } = styles;

  return (
    <View style={containerStyle}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
      padding: 5,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      borderRadius: 5,
      borderWidth: 0,
      margin: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderColor: '#ddd',
      position: 'relative',
      marginBottom: -15
  }
};

export { CardSection };
