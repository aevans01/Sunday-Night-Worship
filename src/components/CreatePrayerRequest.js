import React, { useState } from "react";
import { Form, Button, Container, Card, Row, Col, Alert } from "react-bootstrap";
import Axios from "axios";
import "../style/CreatePrayerRequest.css"; // Ensure this file exists and has the styles defined below

function CreatePrayerRequest() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [request, setRequest] = useState("");
    const [user, setUser] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const post = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page
        console.log(request);
        try {
            await Axios.post(`https://hhbc-snw-api.netlify.app/api/addPR`, {
                description: request,
                user: selectedOption === "option2" ? user : "Anonymous",
                private: selectedOption === "option1",
            });
            setSuccessMessage("Your prayer request has been submitted successfully.");
            setErrorMessage("");
            setRequest("");
            setUser("");
            setSelectedOption(null);
        } catch (err) {
            console.error(err);
            setErrorMessage("There was an error submitting your prayer request. Please try again.");
            setSuccessMessage("");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center py-4">
            <Card className="shadow p-4 w-100" style={{ maxWidth: "600px" }}>
                <Card.Body>
                    <Card.Title className="text-center text-primary fw-bold mb-4">
                        Submit a Prayer Request
                    </Card.Title>
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <Form onSubmit={post}>
                        <Form.Group className="mb-3" controlId="PR">
                            <Form.Label>Prayer Request</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Type your prayer request here..."
                                value={request}
                                onChange={(e) => setRequest(e.target.value)}
                                className="no-resize"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Do you want to keep this request private?</Form.Label>
                            <Row>
                                <Col xs={6}>
                                    <Form.Check
                                        type="radio"
                                        id="radio-yes"
                                        value="option1"
                                        label="Yes"
                                        name="privacyOption"
                                        checked={selectedOption === "option1"}
                                        onChange={handleOptionChange}
                                    />
                                </Col>
                                <Col xs={6}>
                                    <Form.Check
                                        type="radio"
                                        id="radio-no"
                                        value="option2"
                                        label="No"
                                        name="privacyOption"
                                        checked={selectedOption === "option2"}
                                        onChange={handleOptionChange}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                        {selectedOption === "option2" && (
                            <Form.Group className="mb-3">
                                <Form.Label>Your Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                />
                            </Form.Group>
                        )}
                        <div className="text-center">
                            <Button
                                type="submit"
                                variant="primary"
                                className="fw-bold px-5"
                            >
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default CreatePrayerRequest;
