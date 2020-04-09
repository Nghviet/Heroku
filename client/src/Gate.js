import React, {Component} from 'react';
import Login from './Component/Login';
import Signin from './Component/Signin';


import './App.css';

class Gate extends Component {
    render() {
        return (
            <div className = "App">
                <div className = "login">
                    < Login checkLogin = {this.props.changeState} /> 
                </div>
                <div className = "signin"> 
                    < Signin checkSignin = {this.props.changeState} /> 
                </div> 
            </div>
        );
    }
}

export default Gate;