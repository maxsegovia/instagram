import React, { Component } from 'react';
import { View } from 'react-native';
import { Header } from '../common';
import Tabs from './Tabs';

class Navigation extends Component {
    render() {
        const { main } = styles;
        return (
            <View style={main}>
                <Tabs />
            </View>
        );
    }
}

const styles = {
    main: {
        height: '100%',
        paddingBottom: 210,
    },
}

export default Navigation;
