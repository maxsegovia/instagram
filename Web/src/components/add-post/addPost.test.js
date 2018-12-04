import React from 'react';
import ReactDOM from 'react-dom';
import AddPost from './addPost';
import { BrowserRouter as Router } from 'react-router-dom';


it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render( <Router><AddPost/></Router>, div);
    ReactDOM.unmountComponentAtNode(div);
});
