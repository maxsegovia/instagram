import React, { Component } from 'react';
import { View, ScrollView, Text, Dimensions, TouchableOpacity, TouchableHighlight, CameraRoll, Image, Modal } from 'react-native';
import Camera from 'react-native-camera';
import SwipeUpDown from 'react-native-swipe-up-down';
import RNFetchBlob from 'rn-fetch-blob';
import firebase from 'firebase';
import { Input, Spinner } from '../../common';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            photo: null,
            index: null,
            cameraType: 'back',
            mirrorMode: false,
            showModal: false,
            text: '',
            loading: false,
        }
    }

    componentDidMount() {
        CameraRoll.getPhotos({ first: 20, assetType: 'All' })
        .then(r => this.setState({ photos: r.edges }));
    }

    onTextChange(text) {
        this.setState({ text });
    }

    setModalVisible() {
        this.setState({ showModal: this.state.showModal == false ? true : false });
    }

    changeCameraType() {
        switch (this.state.cameraType) {
            case 'back':
                this.setState({ cameraType: 'front', mirrorMode: true });
                break;
            case 'front':
                this.setState({ cameraType: 'back', mirrorMode: false });
                break;
        }
    }

    setPhoto(photo) {
        this.setState({ photo });
        this.setModalVisible();
    }

    takePicture() {
        // CameraRoll.saveToCameraRoll(data.path, 'photo')
        this.camera.capture()
        .then((data) => this.setPhoto(data.path))
        .catch(err => console.error(err));

        this.updateCameraRoll();
    }

    updateCameraRoll() {
        CameraRoll.getPhotos({ first: 20, assetType: 'Photos' })
        .then(r => this.setState({ photos: r.edges }));
    }

    post() {
        this.setState({ loading: true })
        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;

        const userId = firebase.auth().currentUser !== null ? firebase.auth().currentUser.uid : null;
        const path = this.state.photo;

        let mime = 'image/jpg';

        fs.readFile(path, 'base64')
        .then(data => {
            console.log(data);
            firebase.database().ref(`posts/${firebase.auth().currentUser.uid}`).push({
                title: this.state.text,
                image: `data:${mime};base64,${data}`,
                userId,
                createdAt: Date.now(),
            });
        });

        this.setState({ loading: false, showModal: false, text: '', photo: null });
        this.swipeUpDownRef.showMini();
        this.props.navigation.navigate('Feed');
    }

    renderCapturePhotoButtons() {
        const { capture, circle } = styles;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start' }}>
                <TouchableOpacity onPress={() => this.swipeUpDownRef.showFull()} style={{ position: 'absolute', top: -55, left: 10 }}>
                    <Image
                        testID={"galleryButton"}
                        style={{ width: 40, height: 40, tintColor: 'white' }}
                        source={require('../../../assets/images/icons/feed/picture-min.png')}
                        onPress={() => this.swipeUpDownRef.showFull()}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={capture} onPress={this.takePicture.bind(this)} >
                    <View style={circle}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.changeCameraType.bind(this)} style={{ position: 'absolute', top: -60, right: 10 }}>
                    <Image
                        style={{ width: 50, height: 50, tintColor: 'white' }}
                        source={require('../../../assets/images/icons/post/flipCamera.png')}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderCameraRoll() {
        const { scrollView, title } = styles;
        const { width } = Dimensions.get('window');
        return (
            <View>
                <Text style={title}>Galería</Text>
                <ScrollView contentContainerStyle={scrollView}>
                    {
                        this.state.photos.map((p, i) => {
                            return (
                                <TouchableHighlight
                                    style={{opacity: i === this.state.index ? 0.5 : 1}}
                                    key={i}
                                    underlayColor='transparent'
                                    onPress={() => this.setPhoto(p.node.image.uri)}
                                >
                                    <Image
                                        testID={"imageButton" + i}
                                        style={{ width: width/3.2, height: width/3.2 }}
                                        source={{ uri: p.node.image.uri }}
                                        onPress={() => this.setPhoto(p.node.image.uri)}
                                    />
                                </TouchableHighlight>
                            );
                        })
                    }
                </ScrollView>
            </View>
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
        const { modal, modalButtons, previewPost, cancelButton, postButton, modalTitle } = styles;
        return (
            <View style={modal}>
                <View style={modalButtons}>
                    <TouchableOpacity onPress={() => {this.setModalVisible()}}>
                        <Text style={cancelButton}>Cancelar</Text>
                    </TouchableOpacity>
                    <Text style={modalTitle}>Publicación</Text>
                    <TouchableOpacity onPress={() => {this.post()}}>
                        <Text testID={"postButton"} onPress={() => {this.post()}} style={postButton}>Compartir</Text>
                    </TouchableOpacity>
                </View>
                <View style={previewPost}>
                    <Image
                        style={{ width: 100, height: 100, marginRight: 10 }}
                        source={{ uri: this.state.photo }}
                    />
                    <Input testID={"postInput"} value={this.state.text} placeholder="Escribe algo.." autoCorrect={false} autoCapitalize='sentences' color='black' placeholderTextColor={'grey'}
                    onChangeText={this.onTextChange.bind(this)} />
                </View>
                {this.renderLoading()}
            </View>
        );
    }

    render() {
        const { preview, swipe, main, titleButton } = styles;
        return (
            <View style={main}>
                <Camera ref={cam => { this.camera = cam; }} style={preview} aspect={Camera.constants.Aspect.fill} type={this.state.cameraType}  mirrorImage={this.state.mirrorMode}/>
                <SwipeUpDown
                    hasRef={swipeup => {this.swipeUpDownRef = swipeup;}}
                	itemFull={this.renderCameraRoll()}
                	disablePressToShow={false}
                	style={swipe}
                    animation="easeInEaseOut"
                />
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => {

                    }}
                >
                    {this.renderModal()}
                </Modal>
                {this.renderCapturePhotoButtons()}
            </View>
        );
    }
}

const styles = {
    preview: {
        alignItems: 'center',
        height: '80%',
        width: Dimensions.get('window').width,
        zIndex: -1,
    },
    capture: {
        height: 80,
        width: 80,
        backgroundColor: '#cccccc',
        borderRadius: 100,
        color: 'black',
        alignSelf: 'center',
        marginTop: 20,
    },
    circle: {
        height: 60,
        width: 60,
        backgroundColor: '#f6f6f6',
        borderRadius: 80,
        color: 'black',
        alignSelf: 'center',
        marginTop: 10
    },
    scrollView: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    swipe: {
        backgroundColor: '#E1306C',
        zIndex: 1000,
    },
    title: {
        textAlign: 'center',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 20,
        color: 'white',
        marginBottom: 20,
    },
    titleButton: {
        textAlign: 'center',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 20,
        color: 'black',
        margin: 20,
        marginTop: '15%'
    },
    main: {
        height: '100%',
    },
    modal: {
        padding: 20,
        paddingTop: 50,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    previewPost: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
}

export { Post };
