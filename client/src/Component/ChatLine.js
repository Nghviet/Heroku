import React,{Component} from 'react';
import {
    Card
} from 'react-bootstrap';
import './Messenger.css';
class ChatLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : props.raw.chat,
            uid : props.uid,
            toID :props.raw.toID
        }
    }

    render() {
        if(this.state.uid != this.state.toID) 
        return (
            <div class="outgoing_msg">
                <div class="sent_msg">
                    <p>{this.state.data}</p>
                </div>
            </div>
        )
        else return (
            <div class="incoming_msg">
                <div class="incoming_msg_img"> 
                    <img src="https://ptetutorials.com/images/user-profile.png" /> 
                </div>
                <div class="received_msg">
                    <div class="received_withd_msg">
                        <p>{this.state.data}</p>  
                    </div>
                </div>
            </div>
        )
    }
}

export default ChatLine;