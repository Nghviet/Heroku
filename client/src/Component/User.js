import React, {Component} from 'react';
import axios from 'axios';

import {
    Container,
    Card
} from 'react-bootstrap'

import Post from './Post';

class User extends Component {
    constructor(props) {
        super(props);
        var id = props.match.params.id
        this.state = {
            id : id,
            userName : "",
            post:[]
        }
        axios.post("/api/getUser",{id:id})
        .then(res => {
            this.setState({
                userName : res.data.userName
            })
        })
        axios.post("/api/getPost",{id : id})
        .then(res => {
            this.setState({
                post:res.data.post
            });
            console.log(this.state);
        }).catch(err => {});
    }


    render() {
        console.log(this.state);
        if(this.state.userName === null || this.state.userName === "") return null;
        else
        return (
            <Container>
                <Card>
                    <Card.Header>
                        User profile
                    </Card.Header>
                    <Card.Body>

                    </Card.Body>
                </Card>
                {this.state.post.map(post => (
                    <Post key = {post.idpost} post = {post} />
                ))}
            </Container>
        );
    }
}

export default User