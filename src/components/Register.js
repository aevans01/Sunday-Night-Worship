import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Axios from "axios";
import { useUser } from "../UserContext";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
    });

    const [status, setStatus] = useState({ success: null, message: "" });
    const { login } = useUser();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple client-side validation
        if (!formData.email || !formData.username || !formData.password) {
            setStatus({ success: false, message: "Please fill in all required fields." });
            return;
        }

        // API request for registration
        Axios.post(`http://localhost:3001/api/register`, formData)
            .then((response) => {
                if (response.data.success) {
                    setStatus({ success: true, message: "Registration successful! Redirecting to home..." });
                    login(response.data.user); // Automatically log in the user after registration
                    setTimeout(() => navigate("/"), 2000); // Redirect after success
                } else {
                    setStatus({ success: false, message: response.data.message || "Registration failed." });
                }
            })
            .catch((error) => {
                console.error("Error during registration:", error);
                setStatus({ success: false, message: "An error occurred. Please try again later." });
            });
    };

    return (
        <div className="register-container">
            <h2 className="text-center">Create an Account</h2>
            <p className="text-center text-muted">Fill out the form below to register.</p>
            {status.message && (
                <Alert variant={status.success ? "success" : "danger"} className="text-center">
                    {status.message}
                </Alert>
            )}
            <Form className="register-form" onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formUsername" className="mb-3">
                    <Form.Label>Username *</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formFirstName" className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formLastName" className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formPhone" className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Button type="submit" className="w-100" variant="primary">
                    Register
                </Button>
                <p className="text-center mt-3">
                    Already have an account? <a href="/Login">Log in here</a>.
                </p>
            </Form>
        </div>
    );
};

export default RegisterForm;
