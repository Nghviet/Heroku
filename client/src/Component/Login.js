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
        console.log("Login clicked");
        e.preventDefault();
        if(this.props.clicked) return;
        this.props.onClick();

        console.log("Post");
        axios.post('API/login',this.state).then((res) => {
            console.log(res);
            if(res.data.code === 1) {
                this.token = res.data.token;
                this.setState({token : res.data.token});
                this.props.checkLogin(res.data._id,res.data.name);
                
            }
        });
    }

    //Render
    render() { 
        var view;
        if(!this.props.clicked)  view = <button  type = "submit"> Submit </button>;
        else view = <button type="button" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
                </button>
        return (
            <form onSubmit = {this.onSubmitLogin}>
                <table className = "table table-borderless text-white w-auto">
                    <tbody>
                        <tr>
                            <th > Email or phonenumber </th>
                            <th> Password </th>
                        </tr>
                        <tr>
                            <th>
                                <input type = "email" name = "email" onChange = {this.onChange} className = "input" required/>
                            </th>
                            <th>
                                <input type = "password" name = "password" onChange = {this.onChange} className = " input" required />
                            </th>
                            <th>
                                {view}
                            </th>
                        </tr>
                        </tbody>
                    </table> 
            </form>
        )
    }
}

export default Login;