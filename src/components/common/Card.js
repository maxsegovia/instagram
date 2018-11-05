import React from 'react';
import { View } from 'react-native';

const Card = (props) => {
  const { containerStyle } = styles;

  return (
    <View style={containerStyle}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
      flex: 1,
    borderRadius: 10,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    backgroundColor: 'white',
    paddingBottom: 15
  }
};

export { Card };
