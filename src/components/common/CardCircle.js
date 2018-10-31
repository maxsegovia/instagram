import React from 'react';
import { View, TouchableOpacity } from 'react-native';

const CardCircle = (props) => {
    return (
        <View
            style={{
                width: props.children.props.width + 10,
                height: props.children.props.height + 10,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                marginBottom: 8,
                marginLeft: 5,
                marginRight: 5,
                marginTop: 10
            }}
        >
            <TouchableOpacity onPress={props.onPress}>
                {props.children}
            </TouchableOpacity>
        </View>
    );
};

export { CardCircle };
