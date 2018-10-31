import React from 'react';
import { Image } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Feed } from './Feed';
import { Post } from './Post';
import { Search } from './Search';
import { Profile } from './Profile';

const Tabs = TabNavigator({
    Feed: {
        screen: Feed,
        navigationOptions: {
            tabBarLabel: 'Inicio',
            barBackgroundColor: '#E1306C',
            tabBarIcon: ({ tintColor }) =>
                <Image
                    style={{ height: 23, width: 23, tintColor }}
                    source={require('../../assets/images/icons/menu/feed2.png')}
                />
        },
    },
    Post: {
        screen: Post,
        navigationOptions: {
            tabBarLabel: 'Publicar',
            barBackgroundColor: '#E1306C',
            tabBarIcon: ({ tintColor }) =>
                <Image
                    style={{ height: 23, width: 23, tintColor }}
                    source={require('../../assets/images/icons/menu/camera.png')}
                />
        },
    },
    Search: {
        screen: Search,
        navigationOptions: {
            tabBarLabel: 'Buscar',
            barBackgroundColor: '#E1306C',
            tabBarIcon: ({ tintColor }) =>
                <Image
                    style={{ height: 23, width: 23, tintColor }}
                    source={require('../../assets/images/icons/menu/busqueda2.png')}
                />
        },
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            tabBarLabel: 'Perfil',
            barBackgroundColor: '#E1306C',
            tabBarIcon: ({ tintColor }) =>
                <Image
                    style={{ height: 23, width: 23, tintColor }}
                    source={require('../../assets/images/icons/menu/perfil2.png')}
                />
        },
    },
},
{
    tabBarPosition: 'bottom',
    tabBarOptions: {
        activeTintColor: '#E1306C',
        inactiveTintColor: '#6f6f6f',
        showIcon: true,
        upperCaseLabel: false,
        labelStyle: {
            margin: 2,
            fontSize: 12
        },
        tabStyle: {
            padding: 0,
            margin: 0
        },
        iconStyle: {
            padding: 0,
            margin: 0,
            marginTop: 2,
            alignItems: 'center',
            justifyContent: 'center'
        },
        indicatorStyle: {
            backgroundColor: '#E1306C'
        },
        style: {
            backgroundColor: 'white'
        },
        pressColor: '#E1306C',
        allowFontScaling: false
    }
});

export default Tabs;
