import React from 'react';
import { View, StatusBar, Text } from 'react-native';

const Header = ({testID}) => {
  const { viewStyle, logo } = styles;

  return (
    <View testID={testID}>
        <StatusBar backgroundColor='#fff' barStyle='dark-content' />
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
    },
    logo: {
      fontFamily: "Billabong",
      fontSize: 35,
    }
};

export { Header };
