import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import moment from 'moment';
import firebase from 'firebase';
import { Button, Input, Card, CardSection, CardCircle, Spinner, CardList } from '../../common';

class Posts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: this.props.post.userId,
            title: this.props.post.title,
            image: this.props.post.image,
            createdAt: this.props.post.createdAt,
            username: '',
        };
    }

    componentWillMount() {
        //get username
        firebase.database().ref('users/' + this.state.userId).on('value', snapshot =>
            this.setState({ username: snapshot.val().username })
        );
    }

    render() {
        const { container, postHeader, profilePic, username, image, date, title, buttons, icon } = styles;
        return(
            <View style={container}>
                <View style={postHeader}>
                    <Image
                        style={profilePic}
                        source={require('../../../assets/images/icons/profile/profilePic.png')}
                    />
                    <Text style={username} onPress={() => this.props.navigation.navigate('Profile')}>{this.state.username}</Text>
                </View>
                <Image
                    style={image}
                    resizeMode="cover"
                    source={{ uri: this.state.image }}
                />
                <View style={buttons}>
                    <Image
                        style={icon}
                        source={require('../../../assets/images/icons/post/notLike.png')}
                    />
                    <Image
                        style={icon}
                        source={require('../../../assets/images/icons/post/chat.png')}
                    />
                </View>
                <View style={title}>
                    <Text style={username}>{this.state.username} </Text>
                    <Text>{this.state.title}</Text>
                </View>
                <Text style={date}>{moment(this.state.createdAt).fromNow()}</Text>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        marginBottom: 10,
        paddingTop: 20,
        paddingBottom: 20
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    profilePic: {
        width: 35,
        height: 35,
        borderRadius: 18,
        marginRight: 10,
        borderWidth: 2,
        borderColor: '#E1306C',
    },
    username: {
        color: 'black',
        fontFamily: 'Montserrat-SemiBold'
    },
    image: {
        width: '100%',
        height: 300,
    },
    date: {
        color: 'grey',
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        paddingLeft: 20,
        paddingRight: 20,
    },
    title: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
    },
    buttons: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    icon: {
        width: 25,
        height: 25,
        tintColor: 'black',
        marginRight: 15,
    },
}

export default Posts;
