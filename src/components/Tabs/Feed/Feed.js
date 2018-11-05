import React, { Component } from 'react';
import { ScrollView, Text, RefreshControl } from 'react-native';
import firebase from 'firebase';
import Posts from './Posts';

class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            refresh: false,
        };
    }

    componentWillMount() {
        const userId = firebase.auth().currentUser.uid;
        firebase.database().ref('posts/' + userId).orderByChild('createdAt').on('value', snapshot =>
            this.setState({ posts: this.snapshotToArray(snapshot) })
        );
    }

    onRefresh() {
        this.setState({ refresh: true });
        this.updateFeed();
    }

    updateFeed() {
        //get current user logged in
        const userId = firebase.auth().currentUser !== null ? firebase.auth().currentUser.uid : null;
        firebase.database().ref('posts/' + userId).on('value', snapshot =>
            this.setState({ posts: this.snapshotToArray(snapshot) })
        );

        this.finishRefresh();
    }

    finishRefresh() {
        this.setState({ refresh: false });
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

    renderPosts() {
        const { mainLabel } = styles;
        if (this.state.posts.length > 0) {
            return this.state.posts.reverse().map(post =>
                    <Posts post={post} key={post.key} navigation={this.props.navigation} />
            );
        }
        return (
            <Text style={mainLabel}>No hay posts, intenta más tarde.</Text>
        );
    }

    render() {
        return (
            <ScrollView refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={this.onRefresh.bind(this)} />}>
                {this.renderPosts()}
            </ScrollView>
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
    }
};

export { Feed };
