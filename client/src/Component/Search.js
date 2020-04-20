import React , {Component} from 'react';

import {
    Container
} from 'react-bootstrap';

import axios from 'axios';

import SearchTab from './SearchTab';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matchedUser : [],
            id: props.id
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        var keyword = e.target.elements[0].value;
        axios.post("API/search",{keyword : keyword,id : this.state.id}).then(res =>{ 
            this.setState({matchedUser : res.data.matched});
        })
        .catch(err => {
            console.log(err);
        })
    }

    onSubmitTest = e => {
        console.log(e);
    }
    

    render() {
        return (
        <Container>
            <form onSubmit = {this.onSubmit} > 
                <div class = "form-group form-inline">
                    <input type = "text" class = "form-control" placeholder = "Keyword" id = "keyword" />
                    <button type="submit" class="btn btn-primary">Search</button>
                </div>
            </form>
            
            <>
                {this.state.matchedUser.map(matched => (
                    <SearchTab key = {matched.id} userid = {this.state.id} id = {matched.id} name = {matched.name} email = {matched.email} />
                ))}
            </>

        </Container>
        );
    }
}

export default Search;