import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { Form, Button } from "react-bootstrap";
import * as client from "./client";
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

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signup = async () => {
    setErrorMessage(null);
    if (!newUser.username || !newUser.password || !newUser.email) {
      setErrorMessage("All fields are required.");
      return;
    }
    if (newUser.password !== newUser.verifyPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const user = await client.signup(newUser);
      dispatch(setCurrentUser(user));
      navigate("/Kambaz/Dashboard");
    } catch (err: any) {
      setErrorMessage("Signup failed: Username may already be taken.");
    }
  };

  return (
    <div id="wd-signup-screen">
      <h1 className="wd-signup-title">Signup</h1>
      <div className="wd-signup-form">
        {errorMessage && <div className="wd-error-message">{errorMessage}</div>}
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
          onChange={(e) =>
            setNewUser({ ...newUser, verifyPassword: e.target.value })
          }
        />
        <Form.Control
          placeholder="First Name"
          className="wd-input mb-2"
          value={newUser.firstName}
          onChange={(e) =>
            setNewUser({ ...newUser, firstName: e.target.value })
          }
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
            <option value="ADMIN">Admin</option>
          </Form.Select>
        </Form.Group>

        <div className="wd-button-container">
          <Button onClick={signup} className="btn btn-primary wd-signup-btn">
            Sign Up
          </Button>
        </div>
        <div className="wd-button-container">
          <Button
            variant="link"
            onClick={() => navigate("/Kambaz/Account/Signin")}
          >
            Already have an account? Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
