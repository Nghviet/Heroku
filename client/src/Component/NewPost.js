import React ,{Component} from 'react';
import {
    Card,
    Button
} from 'react-bootstrap'
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
        var button;
        if(this.state.reacted == "0") button = <Button variant="light" onClick = {this.onClick} >Like</Button> ;
        else button = <Button variant="primary" onClick = {this.onClick} >Like</Button>;
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
                    {button}
                </Card.Footer>
            </Card>
        ); 
	}
}

export default Post;