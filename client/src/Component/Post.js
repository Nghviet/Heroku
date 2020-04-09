import React ,{Component} from 'react';
import {
    Card
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
            time : time 
        }
	

    }

	render() {
		return (
            <Card>  
                <Card.Header>
                    {this.state.name}
                </Card.Header>
                <Card.Body>
                    {this.state.post}
                </Card.Body>
                <Card.Footer>
                    {this.state.time}
                </Card.Footer>
            </Card>
        ); 
	}
}

export default Post;