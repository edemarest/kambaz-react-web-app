import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./styles.css";

export default function Signup() {
  return (
    <div id="wd-signup-screen">
      <h1 className="wd-signup-title">Signup</h1>
      <div className="wd-signup-form">
        <Form.Control placeholder="username" className="wd-input mb-2" />
        <Form.Control placeholder="password" type="password" className="wd-input mb-2" />
        <Form.Control placeholder="verify password" type="password" className="wd-input mb-3" />
        <div className="wd-button-container">
          <Link to="/Kambaz/Account/Profile" className="btn btn-primary wd-signup-btn">
            Sign Up
          </Link>
        </div>
        <div className="wd-button-container">
          <Link to="/Kambaz/Account/Signin" className="wd-signin-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
