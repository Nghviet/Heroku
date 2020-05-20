import React, {Component} from 'react';
import Login from './Component/Login';
import Signin from './Component/Signin';
import './App.css';

import {
    Alert
} from 'react-bootstrap';

class Gate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked : false,
            failed : false,
            isLogin : false
        }
    }

    onClick = () => {
        this.setState({clicked : true});
        console.log("Clicked and lock");
    }

    onRelease = (isLogin) => {
        this.setState({clicked : false,failed : true,isLogin : isLogin});
        console.log("Release");
    }

    render() {
        var warning;
        if(this.state.failed === true) if(this.state.isLogin === true) warning = <Alert variant = 'danger'> Wrong email or password</Alert>;
        else warning = <Alert variant = 'danger'> Email exsited</Alert>;
        return (
            <div className = "App">
                {warning}
                <div className = "login">
                    < Login checkLogin = {this.props.changeState} onClick = {this.onClick} clicked = {this.state.clicked} release = {this.onRelease}/> 
                </div>
                <div className = "signin"> 
                    < Signin checkSignin = {this.props.changeState} onClick = {this.onClick} clicked = {this.state.clicked} release = {this.onRelease}/> 
                </div> 

                <Alert variant = 'info'> Testing account  : Email:a@a  Password:a </Alert>
            </div>
        );
    }
}

export default Gate;