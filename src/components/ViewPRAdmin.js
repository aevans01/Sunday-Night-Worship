import { useEffect, useState } from "react";
import Axios from "axios";
import { Container, Row, Col, Card, Table, Alert } from "react-bootstrap";
import Button from 'react-bootstrap/Button';

function ViewPrayerRequests() {
    const [List, setList] = useState([]); // Store prayer requests
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get(`https://hhbc-snw-api.netlify.app/api/getPR`);
                if (response.data) {
                    setList(response.data); // Store the prayer requests
                }
            } catch (error) {
                setError("Error fetching prayer requests"); // Set error message
            }
        };
        fetchData();
    }, []);

    // If there's an error, display the error message
    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <strong>{error}</strong>
                </Alert>
            </Container>
        );
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this prayer request?")) return;

        try {
            const response = await Axios.delete(
                `https://hhbc-snw-api.netlify.app/api/deletePR/${id}`
            );

            if (response.status === 200) {
                setList(List.filter((user) => user.id !== id));
                alert("PR deleted successfully!");
            } else {
                alert("Failed to delete PR. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting PR:", error);
            alert("An error occurred while deleting the PR.");
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Prayer Requests</h2>

            {/* If there are no prayer requests */}
            {List.length === 0 ? (
                <Alert variant="info" className="text-center">
                    No prayer requests available at the moment.
                </Alert>
            ) : (
                <Row>
                    <Col md={12}>
                        {/* Table layout for displaying prayer requests */}
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Description</th>
                                    <th>Submitted By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {List.map((request, index) => (
                                    <tr key={index}>
                                        <td><Button variant="danger">Delete</Button></td>
                                        <td>{request.description}</td>
                                        <td>{request.User}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default ViewPrayerRequests;
