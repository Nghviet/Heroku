import React, {Component} from 'react';

import socketClient from 'socket.io-client';

import {
    Button
} from 'react-bootstrap';

const socket = socketClient("localhost:8081");
var uid = undefined;
socket.on('connect', () => {
    if(uid != undefined) socket.emit('shake',{uid : uid});
});

class Messenger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid : props.id,
            chatList : [],
            curChat : [],
            curChatID : ""
        }
        uid = props.id
        socket.emit('shake',{uid : uid});
        socket.emit('chatList',uid);
        socket.on('chatListRet',data =>{ 
            console.log(data);
            this.setState({
                chatList : data.chatList,
                curChat : data.curChat,
                curChatID : data.curChatID
            });
        })
        
    }

    componentDidMount = () => {
        socket.on('newMessage',data => {

        })
    }

    render() {
        return null;
    }
}

export default Messenger