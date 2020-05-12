import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Redirect
} from 'react-router-dom';

import './App.css';

import Gate from './Gate';
import Main from './Main';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : localStorage.getItem('id'),
            name : localStorage.getItem('name'),
            version : "v3"
        }
    }

    changeState = (id,name) => {
        if(id != null) this.setState({id : id,name:name});
        localStorage.setItem('id',id);
        localStorage.setItem('name',name);
        localStorage.setItem('version',this.state.version);
    }

    logOut = () => {
        localStorage.removeItem('id');
        localStorage.removeItem('name');
        this.setState({id:null,name:null});
    }

    render() {
        if(this.state.id != null && localStorage.getItem('version') === this.state.version) {
            return(
                <Main userID = {this.state.id} name = {this.state.name} logOut = {this.logOut}/>
            );
        }
        else {
            return (
                <Router>
                    <Redirect to="/" />
                    <Gate changeState = {this.changeState} />
                </Router>
            );
        }
    }
}

export default App;
