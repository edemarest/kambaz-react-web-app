import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { FaUserCircle, FaTrash, FaEdit } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as usersClient from "../../Account/client";
import * as enrollmentsClient from "../../Enrollments/client";

export default function PeopleTable() {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [users, setUsers] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const isFaculty = currentUser?.role === "FACULTY";

  const loadUsers = async () => {
    const all = await usersClient.findAll();
    setUsers(all);
  };

  const loadEnrollments = async () => {
    const all = await enrollmentsClient.getUserEnrollments();
    setEnrollments(all);
  };

  const handleDelete = async (userId: string) => {
    await usersClient.remove(userId);
    await loadUsers();
  };

  useEffect(() => {
    loadUsers();
    loadEnrollments();
  }, []);

  const enrolledUsers = users.filter((usr) =>
    enrollments.some((e) => e.user === usr._id && e.course === cid)
  );

  return (
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
            {isFaculty && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {enrolledUsers.length > 0 ? (
            enrolledUsers.map((user) => (
              <tr key={user._id}>
                <td className="text-nowrap">
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.loginId}</td>
                <td>{user.section}</td>
                <td>{user.role}</td>
                <td>{user.lastActivity}</td>
                <td>{user.totalActivity}</td>
                {isFaculty && (
                  <td>
                    <Button
                      variant="danger"
                      className="me-2"
                      onClick={() => handleDelete(user._id)}
                    >
                      <FaTrash />
                    </Button>
                    <Button variant="secondary" disabled>
                      <FaEdit />
                    </Button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center text-muted">
                No users enrolled in this course.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
