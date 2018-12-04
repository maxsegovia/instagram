import React, { Component } from 'react';
import { Platform, View, Text, Image, ScrollView, RefreshControl, TouchableOpacity, Dimensions, Modal } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import firebase from 'firebase';
import moment from 'moment';
import { Posts } from '../Feed';
import { Button, Input, Spinner } from '../../common';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: firebase.auth().currentUser.uid,
            profilePicture: null,
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            editUsername: '',
            editFirstName: '',
            editLastName: '',
            editEmail: '',
            editProfilePicture: null,
            followers: 0,
            following: 0,
            posts: null,
            refresh: false,
            showModal: false,
            loading: false,
            showPostModal: false,
            post: null,
        };
    }

    componentWillMount() {
        //get user info
        firebase.database().ref('users/' + this.state.userId).on('value', snapshot =>
            this.setState({
                username: snapshot.val().username,
                editUsername: snapshot.val().username,
                firstName: snapshot.val().firstname,
                editFirstName: snapshot.val().firstname,
                lastName: snapshot.val().lastname,
                editLastName: snapshot.val().lastname,
                email: snapshot.val().email,
                editEmail: snapshot.val().email,
                profilePicture: snapshot.val().profilePicture,
                editProfilePicture: snapshot.val().profilePicture,
                description: snapshot.val().description,
                editDescription: snapshot.val().description,
            })
        );

        firebase.database().ref('posts/' + this.state.userId).orderByChild('createdAt').on('value', snapshot =>
            this.setState({ posts: this.snapshotToArray(snapshot).reverse() })
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
            this.setState({ posts: this.snapshotToArray(snapshot).reverse() })
        );

        this.finishRefresh();
    }

    finishRefresh() {
        this.setState({ refresh: false });
    }

    setModalVisible() {
        this.setState({ showModal: this.state.showModal == false ? true : false });
    }

    setPostModalVisible() {
        this.setState({ showPostModal: this.state.showPostModal == false ? true : false });
    }

    editFirstName(text) {
        this.setState({ editFirstName: text });
    }

    editLastName(text) {
        this.setState({ editLastName: text });
    }

    editEmail(text) {
        this.setState({ editEmail: text });
    }

    editUsername(text) {
        this.setState({ editUsername: text });
    }

    editDescription(text) {
        this.setState({ editDescription: text });
    }

    editProfile() {
        this.setState({ loading: true });
        let imageURL = "null";
        if (this.state.profilePicture !== this.state.editProfilePicture) {
            const Blob = RNFetchBlob.polyfill.Blob;
            const fs = RNFetchBlob.fs;
            window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
            window.Blob = Blob;

            const userId = firebase.auth().currentUser !== null ? firebase.auth().currentUser.uid : null;
            const path = Platform.OS === 'ios' ? this.state.editProfilePicture.replace('file://', '') : this.state.editProfilePicture;
            let mime = 'image/jpg';

            fs.readFile(path, 'base64')
            .then((data) => {
                firebase.database().ref('users/' + this.state.userId).set({
                    username: this.state.editUsername,
                    firstname: this.state.editFirstName,
                    lastname: this.state.editLastName,
                    email: this.state.editEmail,
                    profilePicture: `data:${mime};base64,${data}`,
                    description: this.state.editDescription,
                });

                this.setModalVisible();
                this.setState({ loading: false, username: this.state.editUsername, firstName: this.state.editFirstName, lastName: this.state.editLastName, email: this.state.editEmail, profilePicture: url, description: this.state.editDescription });
            });
        } else {
            firebase.database().ref('users/' + this.state.userId).set({
                username: this.state.editUsername,
                firstname: this.state.editFirstName,
                lastname: this.state.editLastName,
                email: this.state.editEmail,
                profilePicture: this.state.editProfilePicture,
                description: this.state.editDescription,
            });
            this.setModalVisible();
            this.setState({ loading: false, username: this.state.editUsername, firstName: this.state.editFirstName, lastName: this.state.editLastName, email: this.state.editEmail, profilePicture: this.state.editProfilePicture, description: this.state.editDescription });
        }
    }

    selectImage() {
        var options = {
            title: 'Select Profile Picture',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {

            }
            else if (response.error) {

            }
            else {
                this.setState({ editProfilePicture: response.uri });
            }
        });
    }

    signOut() {
        firebase.auth().signOut();
    }

    renderProfilePicture() {
        const {  profilePic } = styles;
        if(this.state.profilePicture !== "null") {
            return (
                <Image
                    style={profilePic}
                    source={{ uri: this.state.profilePicture }}
                />
            );
        }
        return (
            <Image
                style={profilePic}
                source={require('../../../assets/images/icons/profile/profilePic.png')}
            />
        );
    }

    renderPostProfilePicture() {
        const { postProfilePic } = styles;
        if(this.state.profilePicture !== "null") {
            return (
                <Image
                    style={postProfilePic}
                    source={{ uri: this.state.profilePicture }}
                />
            );
        }
        return (
            <Image
                style={postProfilePic}
                source={require('../../../assets/images/icons/profile/profilePic.png')}
            />
        );
    }

    renderEditProfilePicture() {
        const {  profilePic } = styles;
        if(this.state.editProfilePicture !== "null") {
            return (
                <Image
                    style={profilePic}
                    source={{ uri: this.state.editProfilePicture }}
                />
            );
        }
        return (
            <Image
                style={profilePic}
                source={require('../../../assets/images/icons/profile/profilePic.png')}
            />
        );
    }

    renderUserInfo() {
        const { userContainer, infoContainer, userInfo, info, editButton, mainInfo, label, username, userDescription, description } = styles;
        if (this.state.username && this.state.firstName && this.state.lastName && this.state.posts) {
            return(
                <View>
                    <View style={userContainer}>
                        {this.renderProfilePicture()}
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
                        <Text style={username}>{this.state.username}</Text>
                        <Text style={description}>{this.state.description}</Text>
                    </View>
                </View>
            );
        }
    }

    renderPostModal() {
        const { modal, modalButtons, cancelButton, modalTitle, postButton, postContainer, postHeader, postUsername, postImage, postDate, postTitle, postButtons, postIcon } = styles;
        if (this.state.showPostModal && this.state.post) {
            return(
                <View style={modal}>
                    <View style={modalButtons}>
                        <TouchableOpacity onPress={() => {this.setPostModalVisible(); this.setState({ editUsername: this.state.username, editFirstName: this.state.firstName, editLastName: this.state.lastName, editEmail: this.state.email, editProfilePicture: this.state.profilePicture }); }}>
                            <Image
                                style={{ width: 20, height: 20, tintColor: '#E1306C' }}
                                source={require('../../../assets/images/icons/post/back.png')}
                            />
                        </TouchableOpacity>
                        <Text style={modalTitle}>Publicación</Text>
                        <TouchableOpacity onPress={() => {this.editProfile()}}>
                            <Image
                                style={{ width: 20, height: 20, tintColor: 'black' }}
                                source={require('../../../assets/images/icons/post/refresh.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={postContainer}>
                        <View style={postHeader}>
                            {this.renderPostProfilePicture()}
                            <Text style={postUsername}>{this.state.username}</Text>
                        </View>
                        <Image
                            style={postImage}
                            resizeMode="cover"
                            source={{ uri: this.state.post.image }}
                        />
                        <View style={postButtons}>
                            <Image
                                style={postIcon}
                                source={require('../../../assets/images/icons/post/notLike.png')}
                            />
                            <Image
                                style={postIcon}
                                source={require('../../../assets/images/icons/post/chat.png')}
                            />
                        </View>
                        <View style={postTitle}>
                            <Text style={postUsername}>{this.state.username} </Text>
                            <Text>{this.state.post.title}</Text>
                        </View>
                        <Text style={postDate}>{moment(this.state.post.createdAt).fromNow()}</Text>
                    </View>
                </View>
            );
        }
        return null;
    }

    renderPosts() {
        const { mainLabel } = styles;
        const { width } = Dimensions.get('window');
        if (this.state.posts) {
            if (this.state.posts.length > 0) {
                return this.state.posts.map((post, i) => {
                    return (
                        <TouchableOpacity key={i} onPress={() => {this.setPostModalVisible();this.setState({ post });}}>
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

    renderLoading() {
        if (this.state.loading) {
            return (
                <View>
                    <Spinner />
                </View>
            );
        }
    }

    renderModal() {
        const { modal, modalButtons, editForm, cancelButton, postButton, modalTitle, profilePic, editProfilePic, editLabel, signOutButton } = styles;
        return (
            <View style={modal}>
                <View style={modalButtons}>
                    <TouchableOpacity onPress={() => {this.setModalVisible(); this.setState({ editUsername: this.state.username, editFirstName: this.state.firstName, editLastName: this.state.lastName, editEmail: this.state.email, editProfilePicture: this.state.profilePicture }); }}>
                        <Text style={cancelButton}>Cancelar</Text>
                    </TouchableOpacity>
                    <Text style={modalTitle}>Editar</Text>
                    <TouchableOpacity onPress={() => {this.editProfile()}}>
                        <Text style={postButton}>Terminar</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={editProfilePic} onPress={() => this.selectImage()}>
                    {this.renderEditProfilePicture()}
                    <Text style={{ color: 'blue' }}>Cambiar foto de perfil</Text>
                </TouchableOpacity>
                <View style={editForm}>
                    <Text style={editLabel}>Nombre</Text>
                    <Input value={this.state.editFirstName} placeholder="Escribe algo.." autoCorrect={false} autoCapitalize='sentences' color='black' placeholderTextColor={'grey'}
                        onChangeText={this.editFirstName.bind(this)}
                     />
                </View>
                <View style={editForm}>
                    <Text style={editLabel}>Apellido(s)</Text>
                    <Input value={this.state.editLastName} placeholder="Escribe algo.." autoCorrect={false} autoCapitalize='sentences' color='black' placeholderTextColor={'grey'}
                        onChangeText={this.editLastName.bind(this)}
                    />
                </View>
                <View style={editForm}>
                    <Text style={editLabel}>Email</Text>
                    <Input value={this.state.editEmail} placeholder="Escribe algo.." autoCorrect={false} autoCapitalize='sentences' color='black' placeholderTextColor={'grey'}
                        onChangeText={this.editEmail.bind(this)}
                     />
                </View>
                <View style={editForm}>
                    <Text style={editLabel}>Usuario</Text>
                    <Input value={this.state.editUsername} placeholder="Escribe algo.." autoCorrect={false} autoCapitalize='sentences' color='black' placeholderTextColor={'grey'}
                        onChangeText={this.editUsername.bind(this)}
                    />
                </View>
                <View style={editForm}>
                    <Text style={editLabel}>Description</Text>
                    <Input value={this.state.editDescription} placeholder="Escribe algo.." autoCorrect={false} autoCapitalize='sentences' color='black' placeholderTextColor={'grey'}
                        onChangeText={this.editDescription.bind(this)}
                    />
                </View>
                {this.renderLoading()}
                <View style={signOutButton}>
                    <Button onPress={() => this.signOut()}>Cerrar Sesión</Button>
                </View>
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
                <Modal animationType="slide" transparent={false} visible={this.state.showModal} onRequestClose={() => {}}>
                    {this.renderModal()}
                </Modal>
                <Modal animationType="slide" transparent={false} visible={this.state.showPostModal} onRequestClose={() => {}}>
                    {this.renderPostModal()}
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
        height: '100%',
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
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    scrollView: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
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

    },
    postContainer: {
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
    postProfilePic: {
        width: 35,
        height: 35,
        borderRadius: 18,
        marginRight: 10,
        borderWidth: 2,
        borderColor: '#E1306C',
    },
    postUsername: {
        color: 'black',
        fontFamily: 'Montserrat-SemiBold'
    },
    postImage: {
        width: '100%',
        height: 300,
    },
    postDate: {
        color: 'grey',
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        paddingLeft: 20,
        paddingRight: 20,
    },
    postTitle: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
    },
    postButtons: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    postIcon: {
        width: 25,
        height: 25,
        tintColor: 'black',
        marginRight: 15,
    },
};

export { Profile };
