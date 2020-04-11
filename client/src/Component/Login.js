import React, {Component} from 'react';
import axios from 'axios';

import '../App.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password:'',
            token : ''
        }
        this.token = null;
        this.onChange = this.onChange.bind(this);
        this.onSubmitLogin = this.onSubmitLogin.bind(this);
    }

    //Login and Signin

    onChange(evt) {
        this.setState({ [evt.target.name]: evt.target.value });
    }
    onSubmitLogin(e) {
        if(this.props.clicked) return;
        this.onClick();
        e.preventDefault();
        axios.post('API/login',this.state).then((res) => {
            console.log(this.state);
            console.log(res);
            if(res.data.code === 1) {
                this.token = res.data.token;
                this.setState({token : res.data.token});
                console.log("Login complete with " + this.token);
                
                console.log(this.props);

                this.props.checkLogin(res.data._id,res.data.name);
                
            }
        });
    }

    //Render
    render() {
        let view = '';
        if(this.token === null) {
            view =     
                <form onSubmit = {this.onSubmitLogin}>
                    <table className = "table table-borderless text-white w-auto">
                        <tbody>
                        <tr>
                            <th > Email or phonenumber </th>
                            <th> Password </th>
                        </tr>
                        <tr>
                            <th>
                                <input type = "email" name = "email" onChange = {this.onChange} className = "input" />
                            </th>
                            <th>
                                <input type = "password" name = "password" onChange = {this.onChange} className = " input" />
                            </th>
                            <th>
                                <button type = "submit"> Submit </button>
                            </th>
                        </tr>
                        </tbody>
                    </table> 
                </form>;
        }
        else {
            view = <div> Welcome to Facebook </div>;
        }

        return view;
    }
}

export default Login;