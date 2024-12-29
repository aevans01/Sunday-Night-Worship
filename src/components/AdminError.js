import React from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap'; // Using React Bootstrap for a cleaner UI

function AdminError() {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="shadow-lg p-4 text-center">
                            <Card.Body>
                                <h2 className="fw-bold text-danger">Admin Access Required</h2>
                                <p className="lead mb-4">
                                    You need administrative permissions to access this page.
                                </p>
                                <p>
                                    If you are an admin, please{' '}
                                    <Button
                                        variant="primary"
                                        href="/Login-Admin"
                                        className="text-white"
                                    >
                                        Log in here
                                    </Button>
                                    .
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AdminError;
