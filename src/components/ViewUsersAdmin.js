import { useEffect, useState } from "react";
import Axios from "axios";
import { Container, Row, Col, Card, Table, Alert } from "react-bootstrap";

function ViewUsersAdmin() {
    const [List, setList] = useState([]);
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get(`https://hhbc-snw-api.netlify.app/api/getUsers`);
                if (response.data) {
                    setList(response.data); // Store the users
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

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Users</h2>

            {/* If there are no users */}
            {List.length === 0 ? (
                <Alert variant="info" className="text-center">
                    Unable to retrieve users at this time.
                </Alert>
            ) : (
                <Row>
                    <Col md={12}>
                        {/* Table layout for displaying users */}
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Password</th>
                                    <th>Email Address</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Phone Number</th>
                                    <th>Admin Access</th>
                                </tr>
                            </thead>
                            <tbody>
                                {List.map((request, index) => (
                                    <tr key={index}>
                                        <td>{request.username}</td>
                                        <td>{request.password}</td>
                                        <td>{request.emailAddr}</td>
                                        <td>{request.firstName}</td>
                                        <td>{request.lastName}</td>
                                        <td>{request.phoneNum}</td>
                                        <td>{request.Admin}</td>
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

export default ViewUsersAdmin;
