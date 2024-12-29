import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, Container, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useUser } from "../UserContext";
import profilePlaceholder from "../images/profilePic.png";
import "../style/MainNavigation.css"; // Ensure to update this CSS file for alignment and modern look

function MainNavigation() {
    const { user, setUser } = useUser();
    const [profilePic, setProfilePic] = useState(profilePlaceholder);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user && user.id) {
            // Fetch user profile picture
            Axios.post("https://hhbc-snw-api.netlify.app/api/userById", { USERID: user.id })
                .then((res) => {
                    if (res.data && res.data.length > 0) {
                        console.log(res.data[0]);
                        setProfilePic(res.data[0].PROFILEPIC || profilePlaceholder);
                    }
                })
                .catch((err) => {
                    console.error("Error fetching profile picture:", err);
                    setProfilePic(profilePlaceholder);
                });
        }
    }, [user]);

    const handleLogout = () => {
        setUser(null);
        localStorage.clear();
        navigate("/");
    };

    // Check if the user is an admin
    const isAdmin = user && user.role === "1"; // Adjust this condition to match your user data structure

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
                        {/* Conditionally render the Wheel Spin link if the user is an admin */}
                        {isAdmin && (
                            <Nav.Link as={Link} to="/SongSelector">Wheel Spin</Nav.Link>
                        )}
                    </Nav>
                    <Nav className="align-items-center">
                        {user ? (
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
                                    <span className="fw-bold me-3 test">Hello, {user.email}</span>
                                </div>
                                <NavDropdown title={user.firstname} id="user-dropdown">
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
