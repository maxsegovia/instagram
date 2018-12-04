import React, { Component } from 'react';
import firebase from 'firebase';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Button, Input, Card, CardSection, CardCircle, Spinner, CardList } from '../../common';
import { User } from './User';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            start: false,
            leftPosition: '90%',
            users: '$'
        }
    }

    onChangeText(text) {
        this.setState({ text, start: true, leftPosition: '75%' });
    }

    snapshotToArray(snapshot) {
        let array = [];

        snapshot.forEach(childSnapshot => {
            let item = childSnapshot.val();
            item.key = childSnapshot.key;

            array.push(item);
        });

        return array;
    }

    startSearch() {
        this.setState({ start: false, leftPosition: '90%', users: null });
        const text = this.state.text;

        //get users
        firebase.database().ref('users/').orderByKey().startAt(text).once('value', snapshot => {
            this.setState({ users: this.snapshotToArray(snapshot) });
        });
    }

    cancelSearch() {
        this.setState({ text: '', start: false, leftPosition: '75%' });
    }

    renderCancelButton() {
        if (this.state.start || this.state.text) {
            return (
                <TouchableOpacity onPress={this.cancelSearch.bind(this)} style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', margin: 5, position: 'absolute', left: this.state.leftPosition }}>
                    <Image
                        style={{ width: 20, height: 20, tintColor: 'grey' }}
                        source={require('../../../assets/images/icons/menu/search-cancel.png')}
                    />
                </TouchableOpacity>
            );
        }
        return null;
    }

    renderStartButton() {
        if (this.state.start) {
            return (
                <TouchableOpacity onPress={this.startSearch.bind(this)} style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', margin: 5}}>
                    <Text style={{ color: '#E1306C', fontSize: 15 }}>Buscar</Text>
                </TouchableOpacity>
            );
        }
        return null;
    }

    renderUsers() {
        if (this.state.users) {
            if (this.state.users.constructor === Array) {
                if (this.state.users.length > 0) {
                    console.warn(this.state.users);
                    return this.state.users.map((user, i) => {
                        return (
                            <User key={i} user={user} />
                        );
                    });
                }
                return (
                    <Text> No se encontraron usuarios </Text>
                );
            }
        }
        return (
            <Spinner />
        );
    }

    render() {
        const { inputStyle } = styles;
        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-between', alignSelf: 'center', paddingLeft: 10, paddingRight: 10 }}>
                    <TextInput
                        placeholder={'Buscar'}
                        label={'Buscar'}
                        autoCorrect
                        style={inputStyle}
                        value={this.state.text}
                        onChangeText={text => this.onChangeText(text)}
                        placeholderTextColor="#ccc"
                        autoCapitalize={'words'}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        onSubmitEditing={() => this.startSearch()}
                        returnKeyType={'send'}
                        style={{
                            color: 'black',
                            paddingTop: 5,
                            paddingRight: 5,
                            paddingLeft: 5,
                            fontSize: 15,
                            height: 35,
                            flex: 1,
                            backgroundColor: '#eee',
                            borderRadius: 10,
                        }}
                    />
                    {this.renderCancelButton()}
                    {this.renderStartButton()}
                </View>
                <View>
                    {this.renderUsers()}
                </View>
            </View>
        );
    }
}

const styles = {
    inputStyle: {
        flex: 1,
        padding: 10,
        margin: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
        fontSize: 15,
        borderColor: 'white',
    }
}

export { Search };
