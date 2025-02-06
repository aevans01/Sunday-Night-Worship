import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import Axios from 'axios';
import '../style/CreateEvent.css';  // Adding custom styles

function CreateEvent() {
    // Form state
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDetails, setEventDetails] = useState('');
    const [eventImage, setEventImage] = useState(null); // Store selected image
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create form data to send to the API
        const formData = new FormData();
        formData.append('Title', eventTitle);
        formData.append('Date', eventDate);
        formData.append('Location', eventLocation);
        formData.append('Details', eventDetails);
        formData.append('Image', eventImage); // Assuming you are sending the image file directly
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
        try {
            const response = await Axios.post('https://hhbc-snw-api.netlify.app/api/addEvent', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                alert('Event created successfully');
                // Reset form after submission
                setEventTitle('');
                setEventDate('');
                setEventLocation('');
                setEventDetails('');
                setEventImage(null);
            }
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event');
        }
    };

    // Handle image selection from database
    const handleImageSelect = (image) => {
        console.log(image);
        setEventImage(image); // Set selected image as event image
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
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                                required
                                className="input-field"
                            />
                        </Form.Group>

                        <Form.Group controlId="eventDate" className="mb-4">
                            <Form.Label className="fw-bold">Event Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                required
                                className="input-field"
                            />
                        </Form.Group>

                        <Form.Group controlId="eventLocation" className="mb-4">
                            <Form.Label className="fw-bold">Event Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter event location"
                                value={eventLocation}
                                onChange={(e) => setEventLocation(e.target.value)}
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
                                value={eventDetails}
                                onChange={(e) => setEventDetails(e.target.value)}
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
                                            className={`image-preview-card ${eventImage === image ? 'border-primary' : ''}`}
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
