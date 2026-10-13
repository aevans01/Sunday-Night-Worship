import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

class Searchbar extends React.Component {
    state = {
        term: ''
    };

    handleChange = (event) => {
        this.setState({
            term: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        this.props.handleFormSubmit(this.state.term);
    };

    render() {
        return (
            <div className="searchbar-container">
                <Form onSubmit={this.handleSubmit} className="searchbar-form">
                    <Form.Group controlId="videoSearch">
                        <Form.Label className="searchbar-label">Search Videos</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Enter video title"
                                value={this.state.term}
                                onChange={this.handleChange}
                                className="searchbar-input"
                            />
                            <Button type="submit" variant="primary" className="searchbar-button">
                                Search
                            </Button>
                        </InputGroup>
                    </Form.Group>
                    <div className='reminder'>Make sure it has lyrics!!</div>
                </Form>
            </div>
        );
    }
}

export default Searchbar;
