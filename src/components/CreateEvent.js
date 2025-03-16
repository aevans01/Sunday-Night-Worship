import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import Axios from 'axios';
import '../style/CreateEvent.css';  // Adding custom styles

function CreateEvent() {
    // Form state
    const [formData, setFormData] = useState({
        eventTitle: "",
        eventDate: "",
        eventLocation: "",
        eventDetails: "",
        eventImage: null,
    });

    const [imagePreviews, setImagePreviews] = useState([]); // Store fetched images for display

    // Fetch event images from the database
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await Axios.get('https://hhbc-snw-api.netlify.app/api/getPhotos');
                setImagePreviews(response.data); // Assuming images data is in the response
            } catch (error) {
                console.error('Error fetching event images:', error);
            }
        };
        fetchImages();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle image selection from database
    const handleImageSelect = (image) => {
        console.log(image.filename);
        setFormData((prevData) => ({
            ...prevData,
            eventImage: image.filename,  // Store image filename in formData
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Log formData for debugging
        console.log("Form Data Submitted:", formData);

        try {
            const response = await Axios.post('https://hhbc-snw-api.netlify.app/api/addEvent', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                alert('Event created successfully');
                // Reset form after submission
                setFormData({
                    eventTitle: "",
                    eventDate: "",
                    eventLocation: "",
                    eventDetails: "",
                    eventImage: null,
                });
            }
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event');
        }
    };

    return (
        <Container className="create-event-container my-5">
            <h1 className="text-center mb-4">Create Event</h1>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="eventTitle" className="mb-4">
                            <Form.Label className="fw-bold">Event Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter event title"
                                name="eventTitle"  // Add the name attribute
                                value={formData.eventTitle}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            />
                        </Form.Group>

                        <Form.Group controlId="eventDate" className="mb-4">
                            <Form.Label className="fw-bold">Event Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="eventDate"  // Add the name attribute
                                value={formData.eventDate}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            />
                        </Form.Group>

                        <Form.Group controlId="eventLocation" className="mb-4">
                            <Form.Label className="fw-bold">Event Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter event location"
                                name="eventLocation"  // Add the name attribute
                                value={formData.eventLocation}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            />
                        </Form.Group>

                        <Form.Group controlId="eventDetails" className="mb-4">
                            <Form.Label className="fw-bold">Event Details</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Enter event details"
                                name="eventDetails"  // Add the name attribute
                                value={formData.eventDetails}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            />
                        </Form.Group>

                        <Form.Group controlId="eventImage" className="mb-4">
                            <Form.Label className="fw-bold">Event Image</Form.Label>
                            <Row>
                                {imagePreviews.map((image, index) => (
                                    <Col key={index} xs={6} sm={4} md={3} className="mb-3">
                                        <Card
                                            className={`image-preview-card ${formData.eventImage === image.filename ? 'border-primary' : ''}`}
                                            onClick={() => handleImageSelect(image)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Card.Img
                                                variant="top"
                                                src={`data:image/jpeg;base64,${image.image_data}`}
                                                alt="Event Image"
                                                className="event-image-thumbnail"
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 btn-lg">
                            Create Event
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default CreateEvent;
