import React,{Component} from 'react';

import {
    Card
} from 'react-bootstrap';

class CommentLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            raw : props.raw
        }
    }

    render() {
        var userLink = "user/" + this.state.raw.comment_uid;
        return (
            <Card> 
                <Card.Header>
                    <a href = {userLink}> {this.state.raw.name}</a>
                </Card.Header>  
                
                {this.state.raw.comment}                
            </Card>
        );
    }
}

export default CommentLine;