import React, { Component } from 'react';
import  { View, Text, Image } from 'react-native';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.user.username,
            profilePicture: this.props.user.profilePic,
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
        }
    }

    render() {
        const { username, firstName, lastName, profilePicture } = this.state;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'  }}>
                <Image
                    style={{ width: 25, height: 25, borderRadius: 15 }}
                    source={{ uri: profilePicture }}
                />
                <View>
                    <Text>{firstName} {lastName}</Text>
                    <Text>@{username}</Text>
                </View>
            </View>
        );
    }
}

export { User };
