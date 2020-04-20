import React,{Component} from 'react';
import {
    Card
} from 'react-bootstrap';

class ChatListCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friend : props.friend
        }
    }


    onClick = () => {
        this.props.changeChat(this.state.friend.id);
    }

    render() {
        return (
            <Card onClick = {this.onClick}>
            <div class = "chat_people">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png"/> </div>
                <div class="chat_ib">
                    <h5>{this.state.friend.name}</h5>
                </div>
            </div>
            </Card>
        );
    }
}

export default ChatListCard;