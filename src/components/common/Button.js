import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = ({ onPress, children, testID }) => {
    const { textStyle, buttonStyle } = styles;

    return (
        <TouchableOpacity onPress={onPress} style={buttonStyle} testID={testID}>
            <Text style={textStyle}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};

const styles = {
    buttonStyle: {
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: 'white',
        borderRadius: 20,
        margin: 5,
        elevation: 2,
        shadowRadius: 2,
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },
    textStyle: {
        alignSelf: 'center',
        color: '#E1306C',
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 10,
        fontFamily: "Montserrat-SemiBold"
    }
};

export { Button };
