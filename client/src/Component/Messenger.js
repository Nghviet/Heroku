import React, {Component} from 'react';

import socketClient from 'socket.io-client';

import {
    Container,
    Row,
    Col,
    Card,
    ListGroup
} from 'react-bootstrap';

import ChatListCard from './ChatListCard';
import ChatLine from './ChatLine';
import './Messenger.css';
var socket;
if (process.env.NODE_ENV !== 'production') socket = socketClient('http://localhost:8080');
else socket = socketClient('https://arcane-everglades-60566.herokuapp.com/');
var uid = undefined;
socket.on('connect', () => {
    if(uid !== undefined) socket.emit('shake',{uid : uid});
});

class Messenger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid : props.id,
            chatList : [],
            curChat : [],
            curChatID : "",
            curMess : ""
        }
        uid = props.id;
        socket.emit('shake',{uid : uid});
        socket.emit('chatList',uid);
        socket.on('chatListRet',data =>{ 
            this.setState({
                chatList : data.chatList,
                curChat : data.curChat,
                curChatID : data.curChatID
            });
            console.log(data);
            var e = document.getElementById("msg_history");
            e.scrollTop = e.scrollHeight;
        })
        this.changeChat = this.changeChat.bind(this);
    }

    changeChat = (newID) => {
        if(newID === this.state.curChatID) return;
        while(socket.state === false) {
            console.log(socket.status);
        }
        socket.emit('fetch',({
            uid : uid,
            eid : newID
        }));
        socket.on('fetchRep',data => {
            console.log(data);
            this.setState({
                curChatID : newID,
                curChat : data
            });
            var e = document.getElementById("msg_history");
            e.scrollTop = e.scrollHeight;
        })
        
    }

    componentDidMount = () => {
        while(socket.state === false) {
            console.log(socket.status);
        }
        socket.on('newMessage',data => {
            console.log(data);
            var curChat = this.state.curChat;

            curChat.push(data);
            this.setState({curChat : curChat});

            var e = document.getElementById("msg_history");
            e.scrollTop = e.scrollHeight;
        })
    }

    onClick = (e) => {
        e.preventDefault();
        if(document.getElementById("curChat").value !== "") {
            socket.emit("message",{
                message : this.state.curMess,
                fromID : uid,
                toID : this.state.curChatID 
            });
            document.getElementById("curChat").value = "";
        }
        
    }

    onChange = (e) => {
        this.setState({curMess : e.target.value});
    }

    render() {

        return (
            <div class = "container">
                <div class="alert alert-danger" role="alert">
                    Due to time delay in db access and socket, receiving message might not be possible. Will be patch soon.
                </div>
                <div class="messaging">
                    <div class = "inbox_people">
                        <div class = "chat_list active_chat">
                            {this.state.chatList.map(friend => (
                                <ChatListCard friend = {friend} changeChat = {this.changeChat}/>
                            ))}
                        </div>
                    </div>
                    <div class = "mesgs">
                        <div class="msg_history" id = "msg_history">
                            {this.state.curChat.map(chat => (
                                <ChatLine key = {chat.id} raw = {chat} uid = {this.state.uid}/>
                            ))}
                        </div>
                        <div class="type_msg">
                            <div class="input_msg_write">
                            <form onSubmit = {this.onClick}>
                                <input type="text" class="write_msg" id = "curChat" placeholder="Type a message" onChange = {this.onChange}/>
                                
                                <button class="msg_send_btn" type="submit">
                                    <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
                                </button>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Messenger;