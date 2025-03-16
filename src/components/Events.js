import React, { useState, useEffect } from 'react';
import { Card, Button, Col, Row, Container } from 'react-bootstrap';
import Axios from 'axios';

function Events() {
    const [events, setEvents] = useState([]);
    const [eventImages, setEventImages] = useState({}); // Store event images
    var x = null;

    // Fetch all events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await Axios.get('https://hhbc-snw-api.netlify.app/api/getEvents');
                setEvents(response.data);
                console.log("Fetched Events:", response.data);

                // After fetching events, fetch the images
                fetchEventImages(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    // Fetch event images efficiently
    const fetchEventImages = async (events) => {
        if (!events.length) return;

        try {
            const eventImageRequests = events.map(event => {
                console.log("Image: " + event.Image);
                if (event.Image != null) {
                    return Axios.get(`https://hhbc-snw-api.netlify.app/api/getEventPhoto/${event.Image}`)
                        .then(response => (
                            x = response.json(),
                            console.log("Response: " + x),
                            {

                                id: event.id,
                                image: `data:image/jpeg;base64,${response}`,

                            }))
                        .catch(error => {
                            console.error(`Error fetching image for event ${event.id}:`, error);
                            return { id: event.id, image: null }; // Handle errors gracefully
                        });
                }

            });

            // Wait for all requests to complete
            const imageResults = await Promise.all(eventImageRequests);
            const imageMap = Object.fromEntries(imageResults.map(({ id, image }) => [id, image]));
            setEventImages(imageMap);

        } catch (error) {
            console.error('Error fetching event images:', error);
        }
    };

    return (
        <Container>
            <h1 className="text-center my-4">Upcoming Events</h1>
            <Row className="justify-content-center">
                {events.map((event) => (
                    <Col key={event.id} md={4} sm={6} xs={12} className="mb-4">
                        <Card className="event-card">
                            <Card.Img
                                variant="top"
                                src={eventImages[event.id] || 'https://via.placeholder.com/300'}
                                alt={event.Title}
                                className="event-image"
                            />
                            <Card.Body>
                                <Card.Title>{event.Title}</Card.Title>
                                <Card.Text>
                                    <strong>Date: {event.Date.toString().substring(0, 10)}</strong><br />
                                    <small>Location: {event.Location}</small><br /><br />
                                    <p>{event.Details}</p>
                                </Card.Text>
                                <Button variant="primary" href="https://events.circuitree.com/campsiloam" target="_blank">
                                    Register Now
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Events;
