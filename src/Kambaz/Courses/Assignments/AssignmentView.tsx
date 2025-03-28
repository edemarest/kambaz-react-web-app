import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import * as client from "./client";
import "./styles.css";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  points: number;
  dueDate: string;
  availableFrom: string;
  availableUntil: string;
  course: string;
}

export default function AssignmentView() {
  const { cid, aid } = useParams();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAssignment = async () => {
    try {
      setLoading(true);
      setError(null);
      const allAssignments = await client.fetchAssignmentsForCourse(cid!);
      const found = allAssignments.find((a: Assignment) => a._id === aid);
      setAssignment(found || null);
    } catch (err) {
      setError("Failed to load assignment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignment();
  }, [cid, aid]);

  if (loading) {
    return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!assignment) {
    return <p className="text-muted">Assignment not found.</p>;
  }

  return (
    <Card className="p-4 shadow-sm">
      <h3 className="mb-3">{assignment.title}</h3>
      <p>{assignment.description}</p>

      <Row className="mt-4">
        <Col md={4}>
          <strong>Points:</strong>
          <div>{assignment.points}</div>
        </Col>
        <Col md={4}>
          <strong>Due Date:</strong>
          <div>{assignment.dueDate}</div>
        </Col>
        <Col md={4}>
          <strong>Available:</strong>
          <div>{assignment.availableFrom} — {assignment.availableUntil}</div>
        </Col>
      </Row>
    </Card>
  );
}
