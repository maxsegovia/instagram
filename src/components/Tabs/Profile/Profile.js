import React, { Component } from 'react';
import { View, Text, Image, ScrollView, RefreshControl, TouchableOpacity, Dimensions, Modal } from 'react-native';
import firebase from 'firebase';
import { Button, Input } from '../../common';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: firebase.auth().currentUser.uid,
            profilePic: null,
            username: '',
            firstName: '',
            lastName: '',
            followers: 0,
            following: 0,
            posts: null,
            refresh: false,
            showModal: false,
        };
    }

    componentWillMount() {
        //get username
        firebase.database().ref('users/' + this.state.userId).on('value', snapshot =>
            this.setState({
                username: snapshot.val().username,
                firstName: snapshot.val().firstname,
                lastName: snapshot.val().lastname,
                email: snapshot.val().email,
            })
        );

        firebase.database().ref('posts/' + this.state.userId).orderByChild('createdAt').on('value', snapshot =>
            this.setState({ posts: this.snapshotToArray(snapshot) })
        );
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


    onRefresh() {
        this.setState({ refresh: true });
        this.updateFeed();
    }

    updateFeed() {
        firebase.database().ref('posts/' + this.state.userId).on('value', snapshot =>
            this.setState({ posts: this.snapshotToArray(snapshot) })
        );

        this.finishRefresh();
    }

    finishRefresh() {
        this.setState({ refresh: false });
    }

    setModalVisible() {
        this.setState({ showModal: this.state.showModal == false ? true : false });
    }

    editProfile() {
        return 0;
    }

    signOut() {
        firebase.auth().signOut();
    }

    renderUserInfo() {
        const { userContainer, profilePic, infoContainer, userInfo, info, editButton, mainInfo, label, username, userDescription, description } = styles;
        if (this.state.username &&  this.state.firstName && this.state.lastName && this.state.posts) {
            return(
                <View>
                    <View style={userContainer}>
                        <Image
                            style={profilePic}
                            source={require('../../../assets/images/icons/profile/profilePic.png')}
                        />
                        <View style={infoContainer}>
                            <View style={userInfo}>
                                <View style={info}>
                                    <Text style={mainInfo}>{this.state.posts.length}</Text>
                                    <Text style={label}>Publicaciones</Text>
                                </View>
                                <View style={info}>
                                    <Text style={mainInfo}>{this.state.followers}</Text>
                                    <Text style={label}>Seguidores</Text>
                                </View>
                                <View style={info}>
                                    <Text style={mainInfo}>{this.state.following}</Text>
                                    <Text style={label}>Seguidos</Text>
                                </View>
                            </View>
                            <View style={editButton}>
                                <Button onPress={() => this.setModalVisible()}>Editar Perfil</Button>
                            </View>
                        </View>
                    </View>
                    <View style={userDescription}>
                        <Text style={username}>{this.state.firstName} {this.state.lastName}</Text>
                        <Text style={username}>{this.state.username}</Text>
                        <Text style={description}>Lorem Ipsum</Text>
                    </View>
                </View>
            );
        }
    }

    renderPosts() {
        const { mainLabel } = styles;
        const { width } = Dimensions.get('window');
        if (this.state.posts) {
            if (this.state.posts.length > 0) {
                return this.state.posts.reverse().map((post, i) => {
                    return (
                        <TouchableOpacity key={i} onPress={() => console.log(i)}>
                        <Image
                        style={{ width: width/3.2, height: width/3.2, marginTop: 6, }}
                        source={{ uri: post.image }}
                        />
                        </TouchableOpacity>
                    );
                });
            }
        }
        return (
            <Text style={mainLabel}>No hay posts, intenta más tarde.</Text>
        );
    }

    renderModal() {
        const { modal, modalButtons, editForm, cancelButton, postButton, modalTitle, profilePic, editProfilePic, editLabel, signOutButton } = styles;
        return (
            <View style={modal}>
                <View style={modalButtons}>
                    <TouchableOpacity onPress={() => {this.setModalVisible()}}>
                        <Text style={cancelButton}>Cancelar</Text>
                    </TouchableOpacity>
                    <Text style={modalTitle}>Editar</Text>
                    <TouchableOpacity onPress={() => {this.editProfile()}}>
                        <Text style={postButton}>Terminar</Text>
                    </TouchableOpacity>
                </View>
                <View style={editProfilePic}>
                    <Image
                        style={profilePic}
                        source={require('../../../assets/images/icons/profile/profilePic.png')}
                    />
                    <Text style={{ color: 'blue' }}>Cambiar foto de perfil</Text>
                </View>
                <View style={editForm}>
                    <Text style={editLabel}>Nombre</Text>
                    <Input value={this.state.firstName} placeholder="Escribe algo.." autoCorrect={false} autoCapitalize='sentences' color='black' placeholderTextColor={'grey'}
                     />
                </View>
                <View style={editForm}>
                    <Text style={editLabel}>Apellido(s)</Text>
                    <Input value={this.state.lastName} placeholder="Escribe algo.." autoCorrect={false} autoCapitalize='sentences' color='black' placeholderTextColor={'grey'}
                     />
                </View>
                <View style={editForm}>
                    <Text style={editLabel}>Email</Text>
                    <Input value={this.state.email} placeholder="Escribe algo.." autoCorrect={false} autoCapitalize='sentences' color='black' placeholderTextColor={'grey'}
                     />
                </View>
                <View style={editForm}>
                    <Text style={editLabel}>Usuario</Text>
                    <Input value={this.state.username} placeholder="Escribe algo.." autoCorrect={false} autoCapitalize='sentences' color='black' placeholderTextColor={'grey'}
                     />
                </View>
                <Button onPress={() => this.signOut()} style={signOutButton}>Cerrar Sesión</Button>
            </View>
        );
    }

    render() {
        const { mainContainer, scrollView } = styles;
        return (
            <View style={mainContainer}>
                {this.renderUserInfo()}
                <ScrollView contentContainerStyle={scrollView} refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={this.onRefresh.bind(this)} />}>
                    {this.renderPosts()}
                </ScrollView>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => {

                    }}
                >
                    {this.renderModal()}
                </Modal>
            </View>
        );
    }
}

const styles = {
    mainLabel: {
        flex: 1,
        color: 'grey',
        textAlign: 'center',
        alignItems: 'center',
        marginTop: '50%',
    },
    mainContainer: {

    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 0,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
    },
    userDescription: {
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    scrollView: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: '100%',
    },
    profilePic: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    infoContainer: {
        flexDirection: 'column',
        paddingLeft: 10,
        paddingRight: 10,
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    info: {
        flexDirection: 'column',
        marginRight: 10,
    },
    editButton: {

    },
    mainInfo: {
        color: 'black',
        fontFamily: 'Montserrat-SemiBold',
        textAlign: 'center',
        fontSize: 16,
    },
    label: {
        color: 'grey',
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
        fontSize: 13,
    },
    username: {
        color: 'black',
        fontFamily: 'Montserrat-SemiBold'
    },
    description: {
        color: 'grey',
        fontFamily: 'Montserrat-Regular',
    },
    modal: {
        padding: 0,
        paddingTop: 50,
        height: '100%',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
    },
    editForm: {
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cancelButton: {
        color: 'red',
        fontSize: 15,
        fontFamily: 'Montserrat-Regular'
    },
    modalTitle: {
        color: 'black',
        fontSize: 15,
        fontFamily: 'Montserrat-SemiBold'
    },
    postButton: {
        color: 'blue',
        fontSize: 15,
        fontFamily: 'Montserrat-Regular'
    },
    editProfilePic: {
        marginTop: 10,
        marginLeft: 0,
        marginRight: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 10,
        paddingBottom: 10,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f6f6f6'
    },
    editLabel: {
        width: 80,
        paddingTop: 15,
    },
    signOutButton: {
        marginTop: 100,
    }
};

export { Profile };
