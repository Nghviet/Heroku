import React, { Component} from 'react';

import axios from 'axios';

import {
    Card,
    Button
} from 'react-bootstrap';
class SearchTab extends Component {
    constructor(props) {
        super(props);
        console.log(props.id);
        this.state = {
            uID: props.userid,
            id : props.id,
            name : props.name,
            email : props.email,
            clicked : false
        }
        this.onClick = this.onClick.bind(this);
        axios.post("API/checkRequest",{from :this.state.uID, to : this.state.id})
        .then( res => {
            if(res.data.length === 0) this.setState({clicked : false});
            else this.setState({clicked : true});
        })
        .catch(err => {
            console.log(err);
        })
    }

    onClick = () => {
        if(this.state.clicked) {
            axios.post("API/eraseRequest",{from :this.state.uID, to : this.state.id}).then().catch(err => {
                console.log(err);
            })
        }
        else {
            axios.post("API/newRequest",{from :this.state.uID, to : this.state.id}).then().catch(err => {
                console.log(err);
            })
        }

        this.setState({clicked : !this.state.clicked});

    }

    render() {
        var line;
        if(this.state.clicked === true) line = "Requested";
        else line = "Send request";

        return (
            <Card>
                <Card.Body>
                <div class = "container">
                    <div class = "row">
                        <div class = "col-sm-3"></div>
                        <div class = "col-sm-6">
                            <p> Name  :  {this.state.name}  </p>
                            <p> Email :  {this.state.email} </p>
                        </div>
                        <div class = "col-sm-3"> 
                            <Button onClick = {this.onClick}> {line} </Button>
                        </div>
                    </div>
                </div>
                </Card.Body>

            </Card>
        );
    }
}

export default SearchTab;