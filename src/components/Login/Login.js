import React, { Component } from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'firebase';
import { Header, Button, Spinner, Input } from '../common';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: 'login',
            username: '',
            password: '',
            loading: false,
            error: false,
        }
    }

    registerOption() {
        this.setState({ option: 'register', error: false, username: '', password: '' });
    }

    loginOption() {
        this.setState({ option: 'login', error: false, username: '', password: '', email: '', name: '', lastname: '' });
    }

    onUsernameChange(text) {
        this.setState({ username: text });
    }

    onNameChange(text) {
        this.setState({ name: text });
    }

    onLastNameChange(text) {
        this.setState({ lastname: text });
    }

    onEmailChange(text) {
        this.setState({ email: text });
    }

    onPasswordChange(text) {
        this.setState({ password: text });
    }

    login() {
        this.setState({ loading: true, error: false });
        firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
        .then(user => {
            return user;
        })
        .catch(() => {
            this.setState({ error: true });
        });
        this.setState({ loading: false });
    }

    register() {
        this.setState({ loading: true, error: false });
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
            this.writeUserToDatabase();
            return user;
        })
        .catch(() => {
            this.setState({ error: true });
        });
        this.setState({ loading: false });
    }

    writeUserToDatabase() {
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).set({
            email: this.state.email,
            firstname: this.state.name,
            lastname: this.state.lastname,
            username: this.state.username,
        });
    }

    renderError() {
        const { error } = styles;
        switch (this.state.error) {
            case true:
                return (
                    <Text style={error}>Ocurrió un error</Text>
                );
                break;
            case false:
                return null;
                break;
        }
    }

    renderLoginButton() {
        switch (this.state.loading) {
            case true:
                return (
                    <Spinner />
                );
                break;
            case false:
                return (
                    <Button onPress={() => this.login()}>Iniciar Sesión</Button>
                );
                break;
        }
    }

    renderSignUpButton() {
        switch (this.state.loading) {
            case true:
                return(
                    <Spinner />
                );
                break;
            case false:
                return (
                    <Button onPress={() => this.register()}>Registrar</Button>
                );
                break;
        }
    }

    renderSignOption() {
        const { inputStyle, container, title, buttonContainer, main, registerButton, secondary } = styles;
        switch (this.state.option) {
            case 'login':
                return (
                    <View style={main}>
                        <View style={container}>
                            <Text style={title}>INICIAR SESIÓN</Text>
                            <View style={inputStyle}>
                                <Input value={this.state.username} placeholder="Usuario" autoCorrect={false} autoCapitalize='none' color='white' placeholderTextColor={'rgba(255,255,255,0.5)'}
                                onChangeText={this.onUsernameChange.bind(this)} />
                            </View>
                            <View style={inputStyle}>
                                <Input value={this.state.password} placeholder="Contraseña" autoCorrect={false} autoCapitalize='none' isPassword={true} color='white' placeholderTextColor={'rgba(255,255,255,0.5)'}
                                onChangeText={this.onPasswordChange.bind(this)} />
                            </View>
                            {this.renderError()}
                            {this.renderLoginButton()}
                        </View>
                        <View style={secondary}>
                            <Button onPress={() => this.registerOption()}>¿No tienes cuenta?</Button>
                        </View>
                    </View>
                );
                break;
            case 'register':
                return (
                    <View style={main}>
                        <View style={container}>
                            <Text style={title}>REGISTRO</Text>
                            <View style={inputStyle}>
                                <Input value={this.state.name} placeholder="Nombre" autoCorrect={false} autoCapitalize='none' color='white' placeholderTextColor={'rgba(255,255,255,0.5)'}
                                onChangeText={this.onNameChange.bind(this)} />
                            </View>
                            <View style={inputStyle}>
                                <Input value={this.state.lastname} placeholder="Apellido" autoCorrect={false} autoCapitalize='none' color='white' placeholderTextColor={'rgba(255,255,255,0.5)'}
                                onChangeText={this.onLastNameChange.bind(this)} />
                            </View>
                            <View style={inputStyle}>
                                <Input value={this.state.username} placeholder="Usuario" autoCorrect={false} autoCapitalize='none' color='white' placeholderTextColor={'rgba(255,255,255,0.5)'}
                                onChangeText={this.onUsernameChange.bind(this)} />
                            </View>
                            <View style={inputStyle}>
                                <Input value={this.state.email} placeholder="Correo Electrónico" autoCorrect={false} autoCapitalize='none' color='white' placeholderTextColor={'rgba(255,255,255,0.5)'}
                                onChangeText={this.onEmailChange.bind(this)} />
                            </View>
                            <View style={inputStyle}>
                                <Input value={this.state.password} placeholder="Contraseña" autoCorrect={false} autoCapitalize='none' isPassword={true} color='white' placeholderTextColor={'rgba(255,255,255,0.5)'}
                                onChangeText={this.onPasswordChange.bind(this)} />
                            </View>
                            {this.renderError()}
                            {this.renderSignUpButton()}
                        </View>
                        <View style={secondary}>
                            <Button onPress={() => this.loginOption()}>¿Ya tienes cuenta?</Button>
                        </View>
                    </View>
                );
                break;
        }
    }

    render() {
        const { main } = styles;
        return (
            <LinearGradient colors={['white', '#E32452', '#E1306C']} style={main}>
                {this.renderSignOption()}
            </LinearGradient>
        );
    }
}

const styles = {
    inputStyle: {
        margin: 20,
        marginBottom: 30,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        marginTop: -100,
    },
    secondary: {
        marginBottom: 240
    },
    title: {
        fontSize: 20,
        fontFamily: "Montserrat-SemiBold",
        textAlign: 'center',
        margin: 20,
        color: 'white',
    },
    main: {
        height: '100%',
    },
    error: {
        fontSize: 20,
        fontFamily: 'Montserrat-SemiBold',
        color: 'white',
        textAlign: 'center',
    }
};

export default Login;
