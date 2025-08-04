import React, { useState, useEffect } from 'react';
import { Card, Button, Col, Row, Container } from 'react-bootstrap';
import Axios from 'axios';

function Events() {
    const [events, setEvents] = useState([]);
    const [eventImages, setEventImages] = useState({});
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [feedbackVariant, setFeedbackVariant] = useState('success'); // 'success' or 'danger'
    const [registeredEventIds, setRegisteredEventIds] = useState([]);

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

                upcoming.sort((a, b) => new Date(a.Date) - new Date(b.Date));
                past.sort((a, b) => new Date(b.Date) - new Date(a.Date));

                setEvents(fetchedEvents);
                setUpcomingEvents(upcoming);
                setPastEvents(past);

                fetchEventImages(fetchedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    // Fetch registered events for the user
    useEffect(() => {
        const userId = localStorage.getItem('userID');
        if (!userId) return;

        const fetchRegisteredEvents = async () => {
            try {
                console.log(`Fetching registered events for user ID: ${userId}`);
                const response = await Axios.post('https://hhbc-snw-api.netlify.app/api/getUserRegistrations', {
                    userId,
                });

                const registeredIds = response.data.map(reg => reg.eventId);
                setRegisteredEventIds(registeredIds);
            } catch (error) {
                console.error('Error fetching registered events:', error);
            }
        };

        fetchRegisteredEvents();
    }, []);

    // Auto-clear feedback after 5 seconds
    useEffect(() => {
        if (feedbackMessage) {
            const timer = setTimeout(() => {
                setFeedbackMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [feedbackMessage]);

    function handleRegister(eventId) {
        const userId = localStorage.getItem('userID');

        if (!userId) {
            setFeedbackVariant('danger');
            setFeedbackMessage('You must be logged in to register for an event.');
            return;
        }

        Axios.post('https://hhbc-snw-api.netlify.app/api/registerForEvent', {
            userId,
            eventId,
        })
            .then(response => {
                setFeedbackVariant('success');
                setFeedbackMessage('Successfully registered for the event!');
                setRegisteredEventIds(prev => [...prev, eventId]); // ✅ Optional improvement
                console.log('Registration successful:', response.data);
            })
            .catch(error => {
                setFeedbackVariant('danger');
                setFeedbackMessage('Failed to register for the event. Please try again later.');
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
                        {/* Uncomment if using images: */}
                        {/* <Card.Img
                            variant="top"
                            src={eventImages[event.idEvents] || 'https://via.placeholder.com/300'}
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
                                registeredEventIds.includes(event.idEvents) ? (
                                    <Button variant="secondary" disabled>
                                        Already Registered
                                    </Button>
                                ) : (
                                    <Button variant="primary" onClick={() => handleRegister(event.idEvents)}>
                                        Register Now
                                    </Button>
                                )
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );

    return (
        <Container>
            {/* Feedback Message */}
            {feedbackMessage && (
                <Container className="my-3">
                    <div className={`alert alert-${feedbackVariant}`} role="alert">
                        {feedbackMessage}
                    </div>
                </Container>
            )}

            {/* Upcoming Events */}
            <Container className="Upcoming Events">
                <h1 className="text-center my-4">Upcoming Events</h1>
                {renderEvents(upcomingEvents, true)}
            </Container>

            {/* Past Events */}
            <Container className="Past Events">
                <h1 className="text-center my-4">Past Events</h1>
                {renderEvents(pastEvents)}
            </Container>
        </Container>
    );
}

export default Events;
