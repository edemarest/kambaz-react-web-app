import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.accountReducer.currentUser);

  useEffect(() => {
    if (!currentUser) {
      navigate("/Kambaz/Account/Signin");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const signout = () => {
    dispatch(setCurrentUser(null));
    navigate("/Kambaz/Account/Signin");
  };

  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <p><strong>Username:</strong> {currentUser.username}</p>
      <p><strong>First Name:</strong> {currentUser.firstName}</p>
      <p><strong>Last Name:</strong> {currentUser.lastName}</p>
      <p><strong>Email:</strong> {currentUser.email}</p>
      <p><strong>Role:</strong> {currentUser.role}</p>

      <button onClick={signout} className="btn btn-danger w-100" id="wd-signout-btn">
        Sign out
      </button>
    </div>
  );
}
