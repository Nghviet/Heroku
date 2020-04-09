import React, {Component} from 'react';

import {
    Card,
    Button
} from 'react-bootstrap';

import axios from 'axios';

class PendingTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid : props.uid,
            user : props.user,
            clicked : false,
            deleted : false
        }

        this.onClick = this.onClick.bind(this);
        this.onDelete = this.onDelete.bind(this);
        console.log(this.state.user);
    }

    onClick = () => {  
        if(this.state.clicked) {
            axios.post("API/unbind",{id1: this.state.user.fromID, id2: this.state.user.toID})
            .then()
            .catch(err => {console.log(err);});
        }
        else {
            axios.post("API/bind",{id1: this.state.user.fromID, id2: this.state.user.toID})
            .then()
            .catch(err => {console.log(err);});
        }

        this.setState({clicked : !this.state.clicked});
    }

    onDelete = () => {
        console.log("Called");
        this.setState({deleted : true});
        axios.post("API/eraseRequest",{from : this.state.user.id, to: this.state.uid})
        .then()
        .catch(err => {console.log(err)});
    }

    render() {
        if(this.state.deleted) return null;
        var line
        if(this.state.clicked) line = "Unfriend";
        else line = "Add friend";
        return (
            <Card>
                <Card.Body>
                <div className = "container">
                    <div className = "row">
                        <div className = "col-sm-3"></div>
                        <div className = "col-sm-6">
                            <p> Name  :  {this.state.user.name}  </p>
                            <p> Email :  {this.state.user.email} </p>
                        </div>
                        <div className = "col-sm-3"> 
                            <Button onClick = {this.onClick}> {line} </Button>
                            <Button onDelete = {this.onDelete}> Remove request </Button>
                        </div>
                    </div>
                </div>
                </Card.Body>

            </Card>
        );
    }
}

export default PendingTab;