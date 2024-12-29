import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Image } from 'react-bootstrap';
import { useUser } from '../UserContext';
import Axios from 'axios';
import profilePlaceholder from '../images/profilePic.png';

function EditProfile() {
    const { user } = useUser(); // Fetch user from context
    const [profilePic, setProfilePic] = useState(profilePlaceholder);
    const [userDetails, setUserDetails] = useState({
        username: '',
        emailAddr: '',
        firstName: '',
        lastName: '',
        phoneNum: '',
        newProfilePic: null, // To store selected file for profile picture
    });

    // Fetch user details when the page loads
    useEffect(() => {
        if (user && user.id) {
            Axios.post('https://hhbc-snw-api.netlify.app/api/userById', { USERID: user.id })
                .then((res) => {
                    if (res.data && res.data.length > 0) {
                        const { PROFILEPIC, username, emailAddr, firstName, lastName, phoneNum } = res.data[0];
                        setProfilePic(PROFILEPIC || profilePlaceholder);
                        setUserDetails({
                            username,
                            emailAddr,
                            firstName,
                            lastName,
                            phoneNum,
                            newProfilePic: null
                        });
                    }
                })
                .catch((err) => {
                    console.error('Error fetching user profile:', err);
                });
        }
    }, [user]);

    // Handle profile picture change
    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(URL.createObjectURL(file)); // Show a preview of the image
            setUserDetails((prevDetails) => ({ ...prevDetails, newProfilePic: file }));
        }
    };

    // Handle form submission to update user profile
    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare form data for profile update (including the new profile picture)
        const formData = new FormData();
        formData.append('USERID', user.id);
        formData.append('username', userDetails.username);
        formData.append('emailAddr', userDetails.emailAddr);
        formData.append('firstName', userDetails.firstName);
        formData.append('lastName', userDetails.lastName);
        formData.append('phoneNum', userDetails.phoneNum);

        // If there's a new profile picture, append it to the form data
        if (userDetails.newProfilePic) {
            formData.append('profilePic', userDetails.newProfilePic);
        }

        // Send the update request to the backend
        Axios.post('https://hhbc-snw-api.netlify.app/api/updateProfile', formData)
            .then((res) => {
                alert('Profile updated successfully!');
            })
            .catch((err) => {
                console.error('Error updating profile:', err);
                alert('Error updating profile.');
            });
    };

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
                            <h2 className="text-center mb-4">Edit Profile</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formUsername" className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={userDetails.username}
                                        onChange={(e) =>
                                            setUserDetails({ ...userDetails, username: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEmail" className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={userDetails.emailAddr}
                                        onChange={(e) =>
                                            setUserDetails({ ...userDetails, emailAddr: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPhone" className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={userDetails.phoneNum}
                                        onChange={(e) =>
                                            setUserDetails({ ...userDetails, phoneNum: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="formProfilePic" className="mb-3">
                                    <Form.Label>Change Profile Picture</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePicChange}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    Save Changes
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default EditProfile;
