import React , {Component} from 'react';

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
        console.log(e.target.elements[0].value);
        var keyword = e.target.elements[0].value;
        console.log(this.state.id);
        axios.post("API/search",{keyword : keyword,id : this.state.id}).then(res =>{ 
            console.log(res.data);
            this.setState({matchedUser : res.data.matched});
        })
        .catch(err => {
            console.log(err);
        })
    }
    

    render() {
        return (
        <>
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

        </>
        );
    }
}

export default Search;