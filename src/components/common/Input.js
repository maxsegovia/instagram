import React from 'react';
import { TextInput, View } from 'react-native';

const Input = ({ value, onChangeText, autoCorrect, placeholder, isPassword, autoCapitalize, color, placeholderTextColor }) => {
  const { inputStyle, containerStyle } = styles;

  return (
    <View style={containerStyle}>
      <TextInput
        secureTextEntry={isPassword}
        placeholder={placeholder}
        autoCorrect={autoCorrect}
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderTextColor}
        autoCapitalize={autoCapitalize}
        underlineColorAndroid='rgba(0,0,0,0)'
        style={{
            color,
            paddingTop: 5,
            paddingRight: 5,
            paddingLeft: 5,
            fontSize: 15,
            height: 50,
            lineHeight: 23,
            flex: 1,
            borderBottomWidth: 1,
            borderColor: '#ccc',
            paddingBottom: 2,
        }}
      />
    </View>
  );
};

const styles = {
    inputStyle: {
        paddingTop: 5,
        paddingRight: 5,
        paddingLeft: 5,
        fontSize: 15,
        lineHeight: 23,
        flex: 1,
        borderColor: 'white',
        paddingBottom: 10,
        marginBottom: 10,
    },
    containerStyle: {
        height: 40,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
};

export { Input };
