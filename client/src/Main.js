import React ,{Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import {
    Nav,
    Navbar,
    Button
} from "react-bootstrap";

import './App.css';

import Newsfeed from './Component/Newsfeed';
import Search from './Component/Search';
import Pending from './Component/Pending';
import Messenger from './Component/Messenger';
import Credit from './Credit';
import User from './Component/User';
import { createBrowserHistory as createHistory } from "history";
const history = createHistory();


class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userID : props.userID,
            name : props.name,
            keyword : null,
            last :null,
            curKey : "",
            logged : true
        };
        this.logOut = this.logOut.bind(this);
    }

    logOut = (e) => {
        this.setState({userID : null,name : null,logged : false});
        this.props.logOut();
    }

    onSearch = (e) => {
        e.preventDefault();
        if(this.state.curKey !== "") 
        {
            console.log("Called");
            var last = this.state.keyword;
            this.setState({
                last : last,
                keyword : this.state.curKey
            })
            console.log(this.props.history);
            this.props.history.push('/search');
        }
    }

    onSearchChange = (e) => {
        e.preventDefault();
        this.setState({curKey : e.target.value});    
        console.log(e.target.value);
        console.log(this.state.curKey);
    }

    componentWillMount() {
        console.log("Mount");
    }

    render() {
        var logout = null;
        if(this.state.userID == null) logout =  (<Redirect to="/"/>);
        var search = null;
        if(this.state.keyword !=="" && this.state.keyword !== this.state.last) {
            var param = new URLSearchParams();
            param.set("keyword",this.state.keyword);
            
            //search = <Redirect to='/search?' />;
            console.log(param.toString());
        }

        return (
            <Router history = {history}>
                {logout}
                <div >
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand href="/">
                        <img alt="" src="./logo.svg" width="30" height="30" className="d-inline-block align-top"/>{' '}
                            Viet's
                    </Navbar.Brand>

                    <Nav className="mr-auto">
                        <Nav.Link href='/'> Home </Nav.Link>
                        <Nav.Link href='/search'> Search </Nav.Link>
                        <Nav.Link href='/pending'> Pending </Nav.Link>
                        <Nav.Link href='/messenger'> Messenger </Nav.Link>
                        <Nav.Link href='/credit'> Credit </Nav.Link>
                    </Nav>

                    <Button onClick = {this.logOut}> Logout</Button>                 
                </Navbar>
                </div>
                {search}
                <Switch>
                    <Route path = "/search"> <Search keyword = {this.state.keyword} id = {this.state.userID} /> </Route>
                    <Route path = "/pending"> <Pending id = {this.state.userID} /> </Route>
                    <Route path = "/messenger"> <Messenger id = {this.state.userID} /> </Route>
                    <Route path = "/credit"> <Credit/> </Route>
                    <Route path = "/user/:id" component = {User} ></Route>
                    <Route exact path = "/"> <Newsfeed key = {this.state.userID} id = {this.state.userID} name = {this.state.name}/> </Route>    
                </Switch>
            </Router>
        );
    }
}

export default Main;