import React,{Component} from 'react';
import {
    Card,
    Button
} from 'react-bootstrap'
import axios from 'axios';

import CommentLine from './CommentLine';
import './Messenger.css';
class CommentBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid : props.uid,
            pid : props.pid,
            commentLoaded: [],
            last : 0
        };
    }

    onComment = (e) => {
        e.preventDefault();

        var commentID = "comment_" + this.state.pid;
        if(document.getElementById(commentID).value != "")
        axios.post('API/comment',{uid : localStorage.getItem('id'),pid : this.state.pid,comment : document.getElementById(commentID).value})
        .then(res => {
            var comment = {
                uid : localStorage.getItem('id'),
                pid : this.state.pid,
                comment : document.getElementById(commentID).value,
                commentid : res.data.insertId,
                name : localStorage.getItem('name')
            };
            var commentLoaded = this.state.commentLoaded;
            commentLoaded.push(comment);

            console.log(comment);

            document.getElementById(commentID).value = "";
            this.setState({commentLoaded : commentLoaded});
        })
        .catch(err => {
            
        })
    }

    onLoadComment = (e) => {
        e.preventDefault();
        axios.post('API/getComment',{pid : this.state.pid,from : this.state.last, amount:5})
        .then(res => {
            var commentLoaded = this.state.commentLoaded;
            for(var i = 0;i < res.data.length;i++) {commentLoaded.push(res.data[i]);}

            this.setState({commentLoaded:commentLoaded,last: this.state.last + 5});
        })
        .catch(err => {

        })  

    }

    render(){ 

        var commentID = "comment_" + this.state.pid;

        return (
            <Card>
                <Card.Body>
                    <div class="type_msg">
                            <div class="input_msg_write">
                                <form onSubmit = {this.onComment}>
                                    <input type="text" class="write_msg" id = {commentID} placeholder="Comment"/>
                                    
                                    <button class="msg_send_btn" type="submit">
                                        <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
                                    </button>
                                </form>
                            </div>
                        </div>

                    {
                        this.state.commentLoaded.map(comment => (
                            <CommentLine key = {comment.commentid} raw = {comment} />
                        ))
                    }

                    <Button variant = "light" onClick = {this.onLoadComment}> Get new comment </Button> 
                </Card.Body>
            </Card>
        );
    }
}

export default CommentBlock;