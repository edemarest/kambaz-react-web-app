import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as db from "../Database";
import { v4 as uuidv4 } from "uuid";
import { Form, Button } from "react-bootstrap";
import "./styles.css";

export default function Signup() {
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    verifyPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "STUDENT",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signup = () => {
    if (!newUser.username || !newUser.password || !newUser.email) {
      alert("All fields are required.");
      return;
    }
    if (newUser.password !== newUser.verifyPassword) {
      alert("Passwords do not match.");
      return;
    }

    const existingUser = db.users.find((u) => u.username === newUser.username);
    if (existingUser) {
      alert("Username already exists.");
      return;
    }

    const user = { 
      _id: uuidv4(),
      username: newUser.username,
      password: newUser.password,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      dob: "",
      loginId: uuidv4(),
      section: "A",
      lastActivity: new Date().toISOString(),
      totalActivity: "0",
    };

    db.users.push(user);
    dispatch(setCurrentUser(user));
    console.log("New user signed up:", user);

    navigate("/Kambaz/Dashboard");
  };

  return (
    <div id="wd-signup-screen">
      <h1 className="wd-signup-title">Signup</h1>
      <div className="wd-signup-form">
        <Form.Control
          placeholder="Username"
          className="wd-input mb-2"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <Form.Control
          placeholder="Password"
          type="password"
          className="wd-input mb-2"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <Form.Control
          placeholder="Verify Password"
          type="password"
          className="wd-input mb-3"
          value={newUser.verifyPassword}
          onChange={(e) => setNewUser({ ...newUser, verifyPassword: e.target.value })}
        />
        <Form.Control
          placeholder="First Name"
          className="wd-input mb-2"
          value={newUser.firstName}
          onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
        />
        <Form.Control
          placeholder="Last Name"
          className="wd-input mb-2"
          value={newUser.lastName}
          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
        />
        <Form.Control
          placeholder="Email"
          className="wd-input mb-3"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />

        <Form.Group className="mb-3">
          <Form.Label className="wd-role-label">Select Role</Form.Label>
          <Form.Select
            value={newUser.role}
            className="wd-input"
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
          </Form.Select>
        </Form.Group>

        <div className="wd-button-container">
          <Button onClick={signup} className="btn btn-primary wd-signup-btn">
            Sign Up
          </Button>
        </div>
        <div className="wd-button-container">
          <Button variant="link" onClick={() => navigate("/Kambaz/Account/Signin")}>
            Already have an account? Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
