import React ,{Component} from 'react';
import {
    Card
} from 'react-bootstrap'
class Post extends Component {
	constructor(props) {
		super(props);
        this.state = {
            name : props.name,
            post : props.post,
            key  : props.key
        }
    }

	render() {
		return (
            <Card key = {this.state.key} className = "mt-4">   
                <Card.Header>
                    {this.state.name}
                </Card.Header>
                <Card.Body>
                    {this.state.post}
                </Card.Body>
                <Card.Footer>
                    Just now
                </Card.Footer>
            </Card>
        ); 
	}
}

export default Post;