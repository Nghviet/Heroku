import React ,{Component} from 'react';
import {
    Card,
    Button
} from 'react-bootstrap';

import CommentBlock from './CommentBlock';
class Post extends Component {
	constructor(props) {
		super(props);
        var post = props.post;
        var date = new Date(post.date);
        var now  = new Date(Date.now());
        var deltaTime = (now.getTime() - date.getTime())/1000;
        deltaTime = Math.round(deltaTime);
        var time;
        if(deltaTime < 60) {
            time = deltaTime + "seconds ago";
        }
        else {
            deltaTime = Math.round(deltaTime / 60);
            if(deltaTime < 60) {
                time = deltaTime + " minutes ago";
            }
            else {
                deltaTime = Math.round(deltaTime / 60);
                if(deltaTime < 24) {
                    time = deltaTime + " hours ago";
                }
                else {
                    deltaTime = Math.round(deltaTime / 24);
                    if(deltaTime < 30) {
                        time = deltaTime + "days ago";
                    }
                    else {
                        deltaTime = Math.round(deltaTime / 30);
                        if(deltaTime < 12) {
                            time = deltaTime +" months ago";
                        }
                        else {
                            deltaTime = Math.round(deltaTime / 12);
                            time = " years ago";
                        }
                    }
                }
            }
        }
        this.state = {
            name : post.name,
            post : post.post,
            idpost : post.idpost,
            time : time ,
            id : post.post_userid,
            reacted : post.reacted,
            comment : false
        };
        console.log(props.post);
    }

    onChangeState = () => {
        if(this.state.reacted == "0")
            this.setState ({reacted : "1"});
        else this.setState({reacted : "0"});
    }

    onClick = () => {
        console.log(this.state);
        if(this.state.reacted == "0") {
            this.props.onLike(this.state.idpost,this.onChangeState);
        }
        else {
            this.props.onDislike(this.state.idpost,this.onChangeState);
        }
    }

    onOpenComment = () => {
        console.log("Clicked");
        if(this.state.comment == false) this.setState({comment:true});
    }

    onShare = () => {
        console.log(this.state);
    }

	render() {
        var userLink = "user/" + this.state.id;
        var likeButton;
        if(this.state.reacted == "0") likeButton = <Button variant="light" onClick = {this.onClick} >Like</Button> ;
        else likeButton = <Button variant="primary" onClick = {this.onClick} >Like</Button>;

        var commentButton = <Button variant = "light" onClick = {this.onOpenComment}> Comment </Button> ;
        var commentBlock;
        if(this.state.comment) commentBlock = <CommentBlock key = {this.state.idpost} pid = {this.state.idpost} />;
		
        var shareButton = <Button variant = "light" onClick = {this.onShare}> Share </Button>;

        return (
            <Card className = "mt-4">  
                <Card.Header>
                    <a href = {userLink}> {this.state.name} </a>
                    <p> {this.state.time}</p>
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