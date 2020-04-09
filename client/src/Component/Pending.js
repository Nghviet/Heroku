import React, {Component} from 'react';
import axios from 'axios';
import PendingTab from './PendingTab';

class Pending extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uid : props.id,
            pending : []
        }

        console.log(props.id);

        axios.post("API/allRequest",{id : this.state.uid})
        .then(res => {
            console.log(res);
            this.setState({pending : res.data.result});
        })
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <>
                {this.state.pending.map(user => (
                        <PendingTab key = {user.id} user = {user} uid = {this.state.uid} />
                ))}
            </>
        );
    }
}

export default Pending