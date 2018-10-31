import React from 'react';
import { View, StatusBar, Text } from 'react-native';

const Header = () => {
  const { viewStyle, logo } = styles;

  return (
    <View>
        <StatusBar backgroundColor='#fff' barStyle='light-content' />
        <View style={viewStyle}>
          <Text style={logo}>Instagram</Text>
        </View>
    </View>
  );
};

const styles = {
  viewStyle: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        paddingTop: 30,
        position: 'relative',
        shadowRadius: 5,
        shadowOpacity: 1,
    },
    logo: {
      fontFamily: "Billabong",
      fontSize: 35,
    }
};

export { Header };
