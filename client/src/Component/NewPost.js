import React ,{Component} from 'react';
import {
    Card,
    Button
} from 'react-bootstrap';

import CommentBlock from './CommentBlock';
class Post extends Component {
	constructor(props) {
		super(props);
        this.state = {
            name : props.name,
            post : props.post,
            key  : props.key,
            uid : props.uid,
            postid : props.postid,
            reacted : "0"
        }
    }

    onChangeState = () => {
        if(this.state.reacted == "0")
            this.setState ({reacted : "1"});
        else this.setState({reacted : "0"});
    }

    onClick = () => {
        console.log(this.state);
        if(this.state.reacted == "0") {
            this.props.onLike(this.state.postid,this.onChangeState);
        }
        else {
            this.props.onDislike(this.state.postid,this.onChangeState);
        }
    }

	render() {
        var userLink = "user/" + this.state.uid;
        var likeButton;
        if(this.state.reacted == "0") likeButton = <Button variant="light" onClick = {this.onClick} >Like</Button> ;
        else likeButton = <Button variant="primary" onClick = {this.onClick} >Like</Button>;

        var commentButton = <Button variant = "light" onClick = {this.onOpenComment}> Comment </Button> ;
        var commentBlock;
        if(this.state.comment) commentBlock = <CommentBlock key = {this.state.idpost} pid = {this.state.idpost} />;
        
        var shareButton = <Button variant = "light" onClick = {this.onShare}> Share </Button>;

		return (
            <Card key = {this.state.key} className = "mt-4">   
                <Card.Header>
                    <a href = {userLink}> {this.state.name} </a>
                    <p>Just now</p>
                </Card.Header>
                <Card.Body>
                    {this.state.post}
                </Card.Body>
                <Card.Footer>
                    {likeButton} {commentButton} {shareButton}
                </Card.Footer>

                {commentBlock}
            </Card>
        ); 
	}
}

export default Post;