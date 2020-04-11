import React, {Component} from 'react';
import axios from 'axios';

import '../App.css';

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password :'',
            name :'',
            token: ''
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(evt) {
    this.setState({
            [evt.target.name]: evt.target.value
        });
    }

    onSubmit(evt) {
        evt.preventDefault();
        if(this.props.clicked) return;
        this.props.onClick();
        axios.post('API/signup',this.state)
        .then( (res) => {
            if(res.data.code === 1) {
                this.setState({token : res.data.token});
                this.props.checkSignin(res.data._id,this.state.name);
            }
        })
        .catch((err =>{
            console.log(err);
        }));
    }

    render() {
    let view =      
        <form onSubmit = {this.onSubmit} className = "form">
            <table className = "table table-borderless text-black ">
                <tbody>
                    <tr>
                        <th> Username </th>
                        <th> <input type = "text" name = "name" onChange = {this.onChange} className = "input" required/> </th>
                    </tr>
                    <tr>
                        <th> Email </th>
                        <th> <input type = "email" name = "email" onChange = {this.onChange} className = " input" required /> </th>
                    </tr>
                    <tr>
                        <th> Password </th>
                        <th> <input type = "password" name = "password" onChange = {this.onChange} className = "input" required /> </th>
                    </tr>
                </tbody>
            </table> 
            <button type = "submit"> Submit </button>
        </form> ;
    return view
    }
}

export default Signin