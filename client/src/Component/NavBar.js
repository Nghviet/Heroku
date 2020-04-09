import React ,{Component} from 'react';

import {
    Nav,
    Navbar,
    Form,
    Button,
    FormControl
} from "react-bootstrap";

class NavBar extends Component {
    render() {
        return (
            <div >
                <Navbar bg="primary" variant="dark">
                <Navbar.Brand href="/">
                    <img alt="" src="./logo.svg" width="30" height="30" className="d-inline-block align-top"/>{' '}
                        Viet's
                </Navbar.Brand>

                <Nav className="mr-auto">
                    <Nav.Link href='/'> Home </Nav.Link>
                </Nav>

                <Button onClick = {this.props.logOut}> Logout</Button>
                        
                <Form inline onSubmit = {this.props.onSearch} action = "/search" >
                    <FormControl inputRef = {input => {this.inputSearch = input;}} type="text" placeholder="Search" className="mr-sm-2 keyword" />
                    <Button variant="outline-light" type = "submit">Search</Button>
                </Form>

                </Navbar>
            </div>
        );
    }
}

export default NavBar;