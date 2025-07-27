import React, { useState, useEffect } from 'react';
import { Card, Button, Col, Row, Container } from 'react-bootstrap';
import Axios from 'axios';

function Events() {
    const [events, setEvents] = useState([]);
    const [eventImages, setEventImages] = useState({});
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

    // Fetch all events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await Axios.get('https://hhbc-snw-api.netlify.app/api/getEvents');
                const fetchedEvents = response.data;

                const now = new Date();

                const upcoming = [];
                const past = [];

                fetchedEvents.forEach(event => {
                    const eventDate = new Date(event.Date);
                    if (eventDate >= now) {
                        upcoming.push(event);
                    } else {
                        past.push(event);
                    }
                });

                // Optional: sort by date
                upcoming.sort((a, b) => new Date(a.Date) - new Date(b.Date));
                past.sort((a, b) => new Date(b.Date) - new Date(a.Date));

                setEvents(fetchedEvents);
                setUpcomingEvents(upcoming);
                setPastEvents(past);
                console.log('Upcoming events:', upcoming);

                fetchEventImages(fetchedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    function handleRegister(eventId) {
        // Handle registration logic here
        console.log('Registering for event with User:', localStorage.getItem('userID'));
        console.log(`Registering for event with ID: ${eventId}`);
        Axios.post('https://hhbc-snw-api.netlify.app/api/registerForEvent', {
            userId: localStorage.getItem('userID'),
            eventId: eventId,
        }).then(response => {
            console.log('Registration successful:', response.data);
        })
            .catch(error => {
                console.log(error);
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
                            {isUpcoming && (
                                <Button variant="primary" onClick={() => handleRegister(event.idEvents)}>
                                    Register Now
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );


    return (
        <Container>
            <Container className='Upcoming Events'>
                <h1 className="text-center my-4">Upcoming Events</h1>
                {renderEvents(upcomingEvents, true)}
            </Container>

            <Container className='Past Events'>
                <h1 className="text-center my-4">Past Events</h1>
                {renderEvents(pastEvents)}
            </Container>
        </Container>
    );
}

export default Events;
