import React ,{Component} from 'react';
import {
    Card,
    Button
} from 'react-bootstrap'
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
            reacted : post.reacted
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
            this.props.onLike(this.state.idpost,this.onChangeState);
        }
        else {
            this.props.onDislike(this.state.idpost,this.onChangeState);
        }
    }

	render() {
        var userLink = "user/" + this.state.id;
        var button;
        if(this.state.reacted == "0") button = <Button variant="light" onClick = {this.onClick} >Like</Button> ;
        else button = <Button variant="primary" onClick = {this.onClick} >Like</Button>;

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
                    {button}
                </Card.Footer>
            </Card>
        ); 
	}
}

export default Post;