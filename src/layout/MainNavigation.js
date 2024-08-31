import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../style/MainNavigation.css";
import { Nav, Navbar, Container, NavDropdown, Form } from "react-bootstrap";
import profile from "../images/profilePic.png";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

function MainNavigation() {
    const [u, setU] = useState("");
    const [isLogged, setIsLogged] = useState(null);
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState("");

    useEffect(() => {
        const na = localStorage.getItem("name");
        if (na === "null") {
            setU("");
            setIsLogged(false);
            setProfilePic(profile)
        } else {
            setU(na);
            setIsLogged(true);
        }
    }, []);

    // useEffect(() => {
    //     const arr = localStorage.getItem("arr")
    //     const aray = arr.split(",");
    //     console.log("userid ==> ", aray[0]);
    //     Axios.post("http://localhost:3001/userById", {
    //         USERID: aray[0]
    //     }).then((res) => {
    //         console.log("useEffect res.data ==> ", res.data)
    //         setProfilePic(res.data[0].PROFILEPIC)
    //     });
    // }, []);

    function LoggingOut() {
        console.log("ok so this works....");
        localStorage.setItem("name", null);
        localStorage.setItem("arr", null);
        localStorage.setItem("user", false);
        localStorage.setItem("userData", null);
        refreshPage();
        navigate("/");
    }

    function refreshPage() {
        window.location.reload(false);
    }
    return (
        <>
            <Navbar
                className="navbar"
                collapseOnSelect
                expand="lg"
                bg="primary"
            >
                <Container>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <NavDropdown title="Prayer Requests" id="collasible-nav-dropdown">
                                <NavDropdown.Item href="/TournamentList">
                                    View Prayer Requests
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/CreateTournament">
                                    Create A Prayer Request
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="/SongPicker">Song Picker</Nav.Link>
                            <Container>
                            </Container>
                        </Nav>
                        <NavDropdown title={u} id="collasible-nav-dropdown">
                            {isLogged ? (
                                <>
                                    <NavDropdown.Item href="/ViewProfile">
                                        Edit Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href={`/ViewPlayer/${u}`}>Player Profile</NavDropdown.Item>

                                    <NavDropdown.Item href="/QRCodePage">
                                        My QR Code
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={LoggingOut}>
                                        Logout
                                    </NavDropdown.Item>
                                </>
                            ) : (
                                <NavDropdown.Item href="/Login">Login</NavDropdown.Item>
                            )}
                        </NavDropdown>
                        <img className="profile" src={profilePic} />
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default MainNavigation;