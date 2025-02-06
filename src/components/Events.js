import React, { useState, useEffect } from 'react';
import { Card, Button, Col, Row, Container } from 'react-bootstrap';
import Axios from 'axios';

function Events() {
    const [events, setEvents] = useState([]);
    const [eventImages, setEventImages] = useState({}); // Object to store event images

    // Fetch event data
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await Axios.get('https://hhbc-snw-api.netlify.app/api/getEvents');
                setEvents(response.data);
                console.log(response.data); // Log the fetched events data
                fetchEventImages(response.data); // Fetch images after getting events
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    // Fetch event images
    const fetchEventImages = async (events) => {
        //console.log(events); // Log the events dataS
        const imagePromises = events.map(async (event) => {
            try {
                //console.log(event.Image); // Log the image name
                const response = await Axios.get(`https://hhbc-snw-api.netlify.app/api/getEventPhoto/${event.Image}`);
                //console.log(response.data); // Log the fetched image data
                return { id: event.id, image: `data:image/jpeg;base64,${response.data.image_data}` }; // Assuming base64 response
            } catch (error) {
                console.error(`Error fetching image for event ${event.id}:`, error);
                return { id: event.id, image: null };
            }
        });

        const images = await Promise.all(imagePromises);
        const imageMap = {};
        images.forEach(({ id, image }) => {
            imageMap[id] = image;
        });
        setEventImages(imageMap);
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
                                src={eventImages[event.id] || 'https://via.placeholder.com/300'} // Show placeholder if no image
                                alt={event.Title}
                                className="event-image"
                            />
                            <Card.Body>
                                <Card.Title>{event.Title}</Card.Title>
                                <Card.Text>
                                    <strong>{event.Date}</strong><br />
                                    <small>{event.Location}</small>
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
