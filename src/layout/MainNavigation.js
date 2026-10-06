import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, Container, Button, Image } from "react-bootstrap";
import Axios from "axios";
import { useUser } from "../UserContext";
import profilePlaceholder from "../images/profilePic.png";
import "../style/MainNavigation.css"; // Ensure to update this CSS file for alignment and modern look

function MainNavigation() {
    const { user, loading, sessionError, refreshSession, logout } = useUser();
    const [logoutError, setLogoutError] = useState(null);
    const [profilePic, setProfilePic] = useState(profilePlaceholder);

    useEffect(() => {
        if (user && user.id) {
            // Fetch user profile picture
            Axios.get(`/api/userById/${user.id}`)
                .then((res) => {
                    if (res.data) {
                        setProfilePic(res.data.PROFILEPIC || profilePlaceholder);
                    }
                })
                .catch((err) => {
                    console.error("Error fetching profile picture:", err);
                    setProfilePic(profilePlaceholder);
                });
        }
    }, [user]);

    const handleLogout = async () => {
        setLogoutError(null);
        try { await logout(); }
        catch { setLogoutError('Could not sign out. Please try again.'); }
    };

    // Check if the user is an admin
    const isAdmin = user && String(user.role) === "1"; // Adjust this condition to match your user data structure

    return (
        <Navbar bg="light" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
                    HHBC
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>

                        <NavDropdown title="Prayer Requests" id="prayer-dropdown">
                            <NavDropdown.Item as={Link} to="/ViewPrayerRequests">
                                View Prayer Requests
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/CreatePrayerRequest">
                                Create a Prayer Request
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to="/SongPicker">Song Picker</Nav.Link>
                        <NavDropdown title="Photos" id="photos-dropdown">
                            <NavDropdown.Item as={Link} to="/UploadPhotos">Upload Photos</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/PhotoAlbum">Photo Album</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to="/Events">Events</Nav.Link>
                        {/* Conditionally render the Wheel Spin link if the user is an admin */}
                        {isAdmin && (
                            <>
                                <NavDropdown title="Admin" id="admin-dropdown">
                                    <NavDropdown.Item as={Link} to="/SongSelector">Wheel Spin</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/AdminDashboard">Admin Dashboard</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                    </Nav>
                    <Nav className="align-items-center">
                        {logoutError && <span role="alert">{logoutError}</span>}
                        {loading ? <span role="status">Checking session…</span> : sessionError ? (
                            <Button variant="outline-secondary" onClick={refreshSession}>Retry session check</Button>
                        ) : user ? (
                            <>
                                <div className="d-flex align-items-center">
                                    <Image
                                        src={profilePic}
                                        roundedCircle
                                        width="40"
                                        height="40"
                                        className="me-2"
                                        alt="User profile"
                                    />
                                    <span className="fw-bold me-3 test">Hello, {user.firstName || user.username}</span>
                                </div>
                                <NavDropdown title={user.firstName || user.username} id="user-dropdown">
                                    {/* <NavDropdown.Item as={Link} to="/ViewProfile">
                                        Profile
                                    </NavDropdown.Item> */}
                                    <NavDropdown.Item onClick={handleLogout}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <Button
                                    as={Link}
                                    to="/Login"
                                    variant="outline-primary"
                                    className="me-2"
                                >
                                    Login
                                </Button>
                                <Button as={Link} to="/Register" variant="primary">
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MainNavigation;
