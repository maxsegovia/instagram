import React, { Component } from 'react';
import { Text, View } from 'react-native';
import firebase from 'firebase';
import Login from './components/Login/Login';
import Navigation from './components/Tabs/Navigation';
import { Spinner, Header } from './components/common/';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: null
        }
    }

    componentWillMount() {
        //Firebase Credentials
        firebase.initializeApp({
            apiKey: "AIzaSyDAcXMQ1rNqQXIXb8bHSaBiEh3kQjw7Hws",
            authDomain: "myinstagram-bfb68.firebaseapp.com",
            databaseURL: "https://myinstagram-bfb68.firebaseio.com",
            projectId: "myinstagram-bfb68",
            storageBucket: "myinstagram-bfb68.appspot.com",
            messagingSenderId: "456573790116"
        });
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ logged: true });
            } else {
                this.setState({ logged: false });
            }
        });
    }

    renderContent() {
        switch(this.state.logged) {
            case true:
                return (
                    <Navigation />
                );
                break;
            case false:
                return (
                    <Login />
                );
                break;
            default:
                return (
                    <View style={{ marginTop: '50%' }}>
                        <Spinner />
                    </View>
                );
                break;
        }
    }

    render() {
        return (
            <View>
                <Header />
                {this.renderContent()}
            </View>
        );
    }
}

export default App;
