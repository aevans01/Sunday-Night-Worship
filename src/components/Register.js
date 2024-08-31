import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Axios from "axios";

function RegisterForm() {
    const [emailReg, setEmailReg] = useState("");
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [firstnameReg, setFirstnameReg] = useState("");
    const [lastnameReg, setLastnameReg] = useState("");
    const [phoneReg, setPhoneReg] = useState("");

    const [stat, setStat] = useState("");

    const register = () => {
        Axios.post("/register", {
            email: emailReg,
            username: usernameReg,
            password: passwordReg,
            firstName: firstnameReg,
            lastName: lastnameReg,
            phone: phoneReg,
        }).then((response) => {
            console.log("here is response: ");
            console.log(response);
            setStat(response);
        });
    };

    return (
        <>
            <div className="greyBox">
                <Form className='registerForm'>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address *</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            onChange={(e) => {
                                setEmailReg(e.target.value);
                            }}
                        />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username *</Form.Label>
                        <Form.Control
                            type="username"
                            placeholder="Username"
                            onChange={(e) => {
                                setUsernameReg(e.target.value);
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password *</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            onChange={(e) => {
                                setPasswordReg(e.target.value);
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="fname"
                            placeholder="First Name"
                            onChange={(e) => {
                                setFirstnameReg(e.target.value);
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="lname"
                            placeholder="Last Name"
                            onChange={(e) => {
                                setLastnameReg(e.target.value);
                            }}
                        />
                    </Form.Group>
                    <div className="toLogin">
                        <p>
                            Already Have An Account? <a href="/Login">Log In Here</a>
                        </p>
                    </div>
                    <Form.Group>
                        <Button className="" variant="primary" type="submit">
                            Register
                        </Button>
                    </Form.Group>
                </Form>

            </div>
        </>
    );
}

export default RegisterForm;