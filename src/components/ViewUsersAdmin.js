import { useEffect, useState } from "react";
import Axios from "axios";
import { Container, Row, Col, Card, Table, Alert } from "react-bootstrap";
import Button from 'react-bootstrap/Button';

function ViewUsersAdmin() {
    const [List, setList] = useState([]);
    const [error, setError] = useState(null); // Error state
    const [editingIndex, setEditingIndex] = useState(null); // Index of user being edited
    const [editedUser, setEditedUser] = useState(null); // User data for editing

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get(`https://deploy-preview-3--hhbc-snw-api.netlify.app//api/getUsers`);
                if (response.data) {
                    setList(response.data); // Store the users
                }
            } catch (error) {
                setError("Error fetching prayer requests"); // Set error message
            }
        };
        fetchData();
    }, []);

    // Handle the "Edit" button click
    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditedUser({ ...List[index] }); // Initialize the edited user data
    };

    // Handle input changes for editable fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle save changes
    const handleSave = async () => {
        try {
            // Send the updated user data to the backend
            const response = await Axios.put(
                `https://deploy-preview-3--hhbc-snw-api.netlify.app/api/updateUser/${editedUser.id}`,
                editedUser
            );

            if (response.status === 200) {
                // Update the list with the edited user data
                const updatedList = List.map((user, index) =>
                    index === editingIndex ? editedUser : user
                );
                setList(updatedList);
                setEditingIndex(null);
                setEditedUser(null);
                alert("User updated successfully!");
            } else {
                alert("Failed to update user. Please try again.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("An error occurred while updating the user.");
        }
    };



    // Handle cancel editing
    const handleCancel = () => {
        setEditingIndex(null); // Exit editing mode
        setEditedUser(null); // Clear edited user data
    };

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
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await Axios.delete(
                `https://deploy-preview-3--hhbc-snw-api.netlify.app/api/deleteUser/${id}`
            );

            if (response.status === 200) {
                setList(List.filter((user) => user.id !== id));
                alert("User deleted successfully!");
            } else {
                alert("Failed to delete user. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("An error occurred while deleting the user.");
        }
    };

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
                                    <th></th>
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
                                        <td>
                                            {editingIndex === index ? (
                                                <>
                                                    <Row><Button onClick={handleSave}>Save</Button></Row>
                                                    <Row><Button onClick={handleCancel} className="ml-2" variant="warning">Cancel</Button></Row>
                                                </>
                                            ) : (
                                                <>
                                                    <Col>
                                                        <Row><Button onClick={() => handleEdit(index)}>Edit</Button></Row>
                                                        <Row><Button onClick={() => handleDelete(request.id)} className="ml-2" variant="danger">Delete</Button></Row>
                                                    </Col>
                                                </>
                                            )}
                                        </td>
                                        <td>
                                            {editingIndex === index ? (
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={editedUser.username}
                                                    onChange={handleChange}
                                                />
                                            ) : (
                                                request.username
                                            )}
                                        </td>
                                        <td>
                                            {editingIndex === index ? (
                                                <input
                                                    type="text"
                                                    name="password"
                                                    value={editedUser.password}
                                                    onChange={handleChange}
                                                />
                                            ) : (
                                                request.password
                                            )}
                                        </td>
                                        <td>
                                            {editingIndex === index ? (
                                                <input
                                                    type="email"
                                                    name="emailAddr"
                                                    value={editedUser.emailAddr}
                                                    onChange={handleChange}
                                                />
                                            ) : (
                                                request.emailAddr
                                            )}
                                        </td>
                                        <td>
                                            {editingIndex === index ? (
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={editedUser.firstName}
                                                    onChange={handleChange}
                                                />
                                            ) : (
                                                request.firstName
                                            )}
                                        </td>
                                        <td>
                                            {editingIndex === index ? (
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={editedUser.lastName}
                                                    onChange={handleChange}
                                                />
                                            ) : (
                                                request.lastName
                                            )}
                                        </td>
                                        <td>
                                            {editingIndex === index ? (
                                                <input
                                                    type="text"
                                                    name="phoneNum"
                                                    value={editedUser.phoneNum}
                                                    onChange={handleChange}
                                                />
                                            ) : (
                                                request.phoneNum
                                            )}
                                        </td>
                                        <td>
                                            {editingIndex === index ? (
                                                <input
                                                    type="text"
                                                    name="Admin"
                                                    value={editedUser.Admin}
                                                    onChange={handleChange}
                                                />
                                            ) : (
                                                request.Admin
                                            )}
                                        </td>
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
