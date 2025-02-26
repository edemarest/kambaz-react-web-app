import "./styles.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as db from "../Database";

export default function Signin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signin = () => {
    console.log("Attempting to sign in with:", credentials);
    const user = db.users.find(
      (u) => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      alert("Invalid username or password.");
      return;
    }

    dispatch(setCurrentUser(user));
    console.log("User signed in:", user);
    navigate("/Kambaz/Dashboard");
  };

  return (
    <div id="wd-signin-screen">
      <h1 className="wd-signin-title">Sign In</h1>
      <input
        value={credentials.username} 
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        className="form-control wd-input"
        placeholder="Username"
        id="wd-username"
      />
      <input
        value={credentials.password} 
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        className="form-control wd-input"
        placeholder="Password"
        type="password"
        id="wd-password"
      />
      <button onClick={signin} id="wd-signin-btn" className="btn btn-primary w-100">
        Sign In
      </button>
      <p className="wd-signup-text">
        Don't have an account?{" "}
        <Link id="wd-signup-link" to="/Kambaz/Account/Signup">
          Sign up
        </Link>
      </p>
    </div>
  );
}
