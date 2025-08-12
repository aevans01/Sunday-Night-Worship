import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import Axios from "axios";

// ✅ Always send credentials with API calls
Axios.defaults.withCredentials = true;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useUser();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        Axios.post('https://hhbc-snw-api.netlify.app/api/login',
            { email: username, password },
            { withCredentials: true } // important for cookies
        )
            .then((response) => {
                if (response.data.success) {
                    // Store user in context (session cookie is handled automatically)
                    login(response.data.user, response.data.user.role);
                    navigate('/'); // redirect after login
                } else {
                    setError(response.data.message || 'Login failed.');
                }
            })
            .catch((err) => {
                setError(err.response?.data?.message || 'An error occurred during login.');
            });
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100" style={{ maxWidth: '400px' }}>
                <Col>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Login</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    Login
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <div className="text-center mt-3">
                        <small>
                            Don't have an account? <a href="/register">Sign up</a>
                        </small>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
