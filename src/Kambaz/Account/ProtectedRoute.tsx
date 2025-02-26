import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: any }) {
  const currentUser = useSelector((state: any) => state.accountReducer.currentUser);
  return currentUser ? children : <Navigate to="/Kambaz/Account/Signin" />;
}
