import firebase from 'firebase';

export function decider_function(action, params) {
    switch(action) {
        case 'login':
            login(params);
            break;
        case 'register':
            register(params)
            break;
        case 'signOut':
            signOut();
            break;
    }
}

export function navigator_function(screen, withData) {
    switch(screen) {
        case 'navigation':
            //Actions.screen({ with });
            break;
    }
}

function login(params) {
    const { username, password } = params;
    firebase.signInWithEmailAndPassword(username, password)
    .then(user => user);
}

function register(params) {
    const { username, email, firstName, lastName, profilePicture, description, uid } = params;
    firebase.createUserWithEmailAndPassword(username, password)
    .then(user => {
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).set({
            email: this.state.email,
            firstname: this.state.name,
            lastname: this.state.lastname,
            username: this.state.username,
            profilePicture: 'null',
            description: 'Lorem Ipsum',
            uid: firebase.auth().currentUser.uid,
        });
        return user;
    });
}

function signOut() {
    firebase.auth().signOut();
}
