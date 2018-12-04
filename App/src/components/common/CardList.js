import React from 'react';
import { View, TouchableOpacity } from 'react-native';

const CardList = (props) => {
  const { containerStyle } = styles;

  return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={containerStyle}>
                {props.children}
            </View>
        </TouchableOpacity>
  );
};

const styles = {
    containerStyle: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingLeft: 10,
        paddingRight: 10
    }
};

export { CardList };
