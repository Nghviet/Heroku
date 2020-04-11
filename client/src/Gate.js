import React, {Component} from 'react';
import Login from './Component/Login';
import Signin from './Component/Signin';
import './App.css';

class Gate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked : false
        }
    }

    onClick = () => {
        this.setState({clicked : true});
    }

    render() {
        return (
            <div className = "App">
                <div className = "login">
                    < Login checkLogin = {this.props.changeState} clicked = {this.state.clicked}/> 
                </div>
                <div className = "signin"> 
                    < Signin checkSignin = {this.props.changeState} clicked = {this.state.clicked} /> 
                </div> 
            </div>
        );
    }
}

export default Gate;