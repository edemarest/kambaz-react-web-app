import { useSelector, useDispatch } from "react-redux";
import { Table, Button } from "react-bootstrap";
import { FaUserCircle, FaTrash, FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import * as usersClient from "../../Account/client";
import PeopleDetails from "./Details";
import { setCurrentUser } from "../../Account/reducer";
import "./index.css";

export default function PeopleTable({
  users = [],
  selectedUser,
  refreshUsers,
}: {
  users?: any[];
  selectedUser?: any;
  refreshUsers?: () => void;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (userId: string) => {
    await usersClient.deleteUser(userId);
    if (userId === currentUser._id) {
      dispatch(setCurrentUser(null));
      navigate("/Kambaz/Account/Signin");
    } else {
      if (refreshUsers) await refreshUsers();
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (currentUser && a._id === currentUser._id) return -1;
    if (currentUser && b._id === currentUser._id) return 1;
    return 0;
  });

  return (
    <>
      {selectedUser && (
        <PeopleDetails user={selectedUser} refreshUsers={refreshUsers} />
      )}
      <div id="wd-people-table">
        <Table striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Login ID</th>
              <th>Section</th>
              <th>Role</th>
              <th>Last Activity</th>
              <th>Total Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.length > 0 ? (
              sortedUsers.map((user) => {
                const isCurrentUser = currentUser && currentUser._id === user._id;
                const canEdit = currentUser?.role === "ADMIN" || isCurrentUser;

                return (
                  <tr key={user._id} className={isCurrentUser ? "table-success" : ""}>
                    <td className="text-nowrap">
                      <Link to={`/Kambaz/Account/Users/${user._id}`} className="text-decoration-none">
                        <FaUserCircle className="me-2 fs-1 text-secondary" />
                        {user.firstName} {user.lastName}
                      </Link>
                    </td>
                    <td>{user.loginId}</td>
                    <td>{user.section}</td>
                    <td>{user.role}</td>
                    <td>{user.lastActivity}</td>
                    <td>{user.totalActivity}</td>
                    <td>
                      {canEdit ? (
                        <div className="d-flex">
                          <Button variant="danger" className="me-2" onClick={() => handleDelete(user._id)}>
                            <FaTrash />
                          </Button>
                          <Button variant="secondary" onClick={() => navigate(`/Kambaz/Account/Users/${user._id}`)}>
                            <FaEdit />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-muted">
                  No users to display.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}
