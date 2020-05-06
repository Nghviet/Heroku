import React ,{Component} from 'react';
import axios from 'axios';

import '../App.css';

import {
    Card,
    Button,
    Container
} from 'react-bootstrap';

import Post from './Post';
import NewPost from './NewPost';

class Newsfeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : props.id,
            name : props.name,
            post : [],
            currentPost : null,
            newPost : []
        };  
        axios.post('API/allPost',{userID : this.state.id})
        .then(res => {
            this.setState({post : res.data});
        }).catch(err =>{
            console.log(err)
        });

        this.onLike = this.onLike.bind(this);
        this.onDislike = this.onDislike.bind(this);
    }

    changeID = (newID) => {
        this.setState({id : newID});
        if(newID != null) {
            axios.post('API/allPost',{userID : this.state.id})
            .then( res => {
                if(res != null) {
                    this.setState({post : res.data});
                }
            })
            .catch(err => {console.log(err);});
        }
        else this.setState({post:null});
    }

    onPost = (e) => {
        if(this.state.currentPost != null) {
            var mess = {
                userID : this.state.id , 
                post : this.state.currentPost ,
                name : this.state.name
            }
            
            axios.post('API/post', mess)
            .then( res => {
                console.log(res);
                if(res.code === 0) return;
                var newPosts = this.state.newPost;
                newPosts.unshift({
                    post : this.state.currentPost,
                    id : res.data.result.insertId
                });
                this.setState({
                    currentPost : null,
                    newPost : newPosts,
                });

                document.getElementById("newPost").value = "";
            })
            .catch(err =>{
                console.log(err);
            });
        }     
    }

    onChange = (e) => {
        this.setState({currentPost : e.target.value});
    }

    onLike = (postid,callback) => {
        console.log({
            id : this.state.id,postid : postid
        })
        axios.post('API/like',{id : this.state.id,postid : postid})
        .then( res => {
                callback();
        })
        .catch(err => {

        })
    }

    onDislike = (postid,callback) => {
        axios.post('API/unlike',{id : this.state.id,postid : postid})
        .then(res => {
                callback();
        })
        .catch(err => {

        })
    }

    render() {
        return (
        <Container>
            <Card className = "mt-2">
                <Card.Header> New post</Card.Header>
                <Card.Body> 
                    <form onSubmit = {this.onPost}> 
                        <textarea className="form-control" id="newPost" rows="5" onChange = {this.onChange}/>
                        <Button onClick = {this.onPost}> Post </Button> 
                    </form>
                </Card.Body>
            </Card>
            {this.state.newPost.map(post => (
                <NewPost key = {post.id} post = {post.post} postid = {post.id} name = {this.state.name} uid = {this.state.id}  onLike = {this.onLike} onDislike = {this.onDislike}/>
            ))}

            {this.state.post.map(post => (
                <Post key = {post.idpost} post = {post}   onLike = {this.onLike} onDislike = {this.onDislike}/>
            ))}
        </Container>);
    }
}

export default Newsfeed;