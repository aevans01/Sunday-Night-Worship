import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Image } from 'react-bootstrap';
import { useUser } from '../UserContext'; // Assuming you are using UserContext to manage user state
import Axios from 'axios';
import profilePlaceholder from '../images/profilePic.png'; // Placeholder image in case the user doesn't have one

function ViewProfile() {
    const { user } = useUser(); // Fetch user from context
    const [profilePic, setProfilePic] = useState(profilePlaceholder);
    const [userDetails, setUserDetails] = useState({
        username: '',
        emailAddr: '',
        firstName: '',
        lastName: '',
        phoneNum: ''
    });

    // Fetch user details when the page loads
    useEffect(() => {
        console.log('User ID:', user.username.id);
        var userID = user.username.id
        if (user && user.username.id) {
            console.log('Fetching user profile for ID:', userID);
            Axios.get(`https://hhbc-snw-api.netlify.app/api/userById/${userID}`,)
                .then((res) => {
                    if (res.data) {
                        console.log('User profile data:', res.data);
                        const { PROFILEPIC, username, emailAddr, firstName, lastName, phoneNum } = res.data;
                        setProfilePic(PROFILEPIC || profilePlaceholder);
                        setUserDetails({
                            username,
                            emailAddr,
                            firstName,
                            lastName,
                            phoneNum
                        });
                    }
                })
                .catch((err) => {
                    console.error('Error fetching user profile:', err);
                });
        }
    }, [user]);

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-lg p-4">
                        <Card.Body>
                            <div className="d-flex justify-content-center mb-4">
                                <Image
                                    src={profilePic}
                                    roundedCircle
                                    width="150"
                                    height="150"
                                    alt="Profile"
                                    className="border border-2 border-primary"
                                />
                            </div>
                            <h2 className="text-center mb-4">{userDetails.firstName} {userDetails.lastName}</h2>
                            <Form>
                                <Form.Group controlId="formUsername" className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" value={userDetails.username} readOnly />
                                </Form.Group>
                                <Form.Group controlId="formEmail" className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control type="email" value={userDetails.emailAddr} readOnly />
                                </Form.Group>
                                <Form.Group controlId="formPhone" className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control type="text" value={userDetails.phoneNum} readOnly />
                                </Form.Group>
                                <Button variant="primary" href="/EditProfile" className="w-100">
                                    Edit Profile
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ViewProfile;
