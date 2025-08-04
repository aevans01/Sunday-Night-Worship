import React, { useState, useEffect } from 'react';
import { Card, Button, Col, Row, Container } from 'react-bootstrap';
import Axios from 'axios';

function ViewEventsAdmin() {
    const [events, setEvents] = useState([]);
    const [eventImages, setEventImages] = useState({});

    // Fetch all events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await Axios.get('https://hhbc-snw-api.netlify.app/api/getEvents');
                const fetchedEvents = response.data;

                const now = new Date();

                setEvents(fetchedEvents);
                fetchEventImages(fetchedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    function getAttendees(eventId) {
        console.log(`Fetching attendees for event ID: ${eventId}`);
        Axios.post('https://hhbc-snw-api.netlify.app/api/getAttendees', {
            eventId: eventId,
        }).then(response => {
            console.log('Attendees:', response.data);
            alert(`Attendees for event ID ${eventId}:\n` + response.data.map(a => `UserID: ${a.USERID}, Name: ${a.NAME}`).join('\n'));
        })
            .catch(error => {
                console.log(error);
                alert('Error fetching attendees.');
            });
    }


    const fetchEventImages = async (events) => {
        if (!events.length) return;

        try {
            const eventImageRequests = events.map(event => {
                if (event.Image != null) {
                    return Axios.get(`https://hhbc-snw-api.netlify.app/api/getEventPhoto/${event.Image}`)
                        .then(response => ({
                            id: event.id,
                            image: `data:image/jpeg;base64,${response}`,
                        }))
                        .catch(error => {
                            console.error(`Error fetching image for event ${event.id}:`, error);
                            return { id: event.id, image: null };
                        });
                }
                return null;
            }).filter(Boolean);

            const imageResults = await Promise.all(eventImageRequests);
            const imageMap = Object.fromEntries(imageResults.map(({ id, image }) => [id, image]));
            setEventImages(imageMap);

        } catch (error) {
            console.error('Error fetching event images:', error);
        }
    };

    const renderEvents = (eventList, isUpcoming = false) => (
        <Row className="justify-content-center">
            {eventList.map((event) => (
                <Col key={event.id} md={4} sm={6} xs={12} className="mb-4">
                    <Card className="event-card">
                        {/* Uncomment this if you want images:
                    <Card.Img
                        variant="top"
                        src={eventImages[event.id] || 'https://via.placeholder.com/300'}
                        alt={event.Title}
                        className="event-image"
                    /> */}
                        <Card.Body>
                            <Card.Title>{event.Title}</Card.Title>
                            <Card.Text>
                                <strong>Date: {new Date(event.Date).toLocaleDateString()}</strong><br />
                                <small>Location: {event.Location}</small><br /><br />
                                <p>{event.Details}</p>
                            </Card.Text>
                            <Row>
                                <Col>
                                    <Button variant="primary" onClick={() => "/ViewAttendees"}>
                                        View Attendees
                                    </Button>
                                </Col>
                                <Col>
                                    <Button variant="primary" >
                                        Edit Event
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );


    return (
        <Container>
            <Container className='Events'>
                <h1 className="text-center my-4">Upcoming Events</h1>
                {renderEvents(events)}
            </Container>
        </Container>
    );
}

export default ViewEventsAdmin;
