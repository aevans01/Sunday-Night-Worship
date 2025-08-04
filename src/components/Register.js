import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
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
    const [showModal, setShowModal] = useState(false);
    const { login } = useUser();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting registration with data:", formData);
        if (!formData.email || !formData.username || !formData.password) {
            setStatus({ success: false, message: "Please fill in all required fields." });
            setShowModal(true);
            return;
        }

        Axios.post(`https://hhbc-snw-api.netlify.app/api/register`, formData)
            .then((response) => {
                console.log("Registration response:", response.data);
                if (response.data.success) {
                    setStatus({ success: true, message: "Registration successful!" });
                    //login(response.data.user);
                    setShowModal(true);
                } else {
                    setStatus({ success: false, message: response.data.message || "Registration failed." });
                    setShowModal(true);
                }
            })
            .catch((error) => {
                console.error("Error during registration:", error);
                setStatus({ success: false, message: "An error occurred. Please try again later." });
                setShowModal(true);
            });
    };

    const handleModalClose = () => {
        setShowModal(false);
        if (status.success) {
            navigate("/");
        }
    };

    return (
        <div className="register-container">
            <h2 className="text-center">Create an Account</h2>
            <p className="text-center text-muted">Fill out the form below to register.</p>

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

            {/* Feedback Modal */}
            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{status.success ? "Success" : "Error"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{status.message}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={status.success ? "success" : "secondary"} onClick={handleModalClose}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RegisterForm;
