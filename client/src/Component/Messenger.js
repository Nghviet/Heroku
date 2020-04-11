import React, {Component} from 'react';

import socketClient from 'socket.io-client';

import {
    Button
} from 'react-bootstrap';

var socket;
if (process.env.NODE_ENV !== 'production') socket = socketClient('http://localhost:5000');
else socket = socketClient('https://arcane-everglades-60566.herokuapp.com/');
var uid = undefined;
socket.on('connect', () => {
    if(uid != undefined) socket.emit('shake',{uid : uid});
});

console.log(process.env.PORT);

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