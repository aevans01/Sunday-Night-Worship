import React, { useState } from 'react';
import Axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

function AdminDashboard() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);

  const handleDelete = async () => {
    try {
      const response = await Axios.post(`https://hhbc-snw-api.netlify.app/api/deleteSongs`);

      // Assume API returns something like: { deletedCount: 42 }
      const count = response.data?.deletedCount || 0;

      setDeletedCount(count);
      setShowConfirmModal(false); // Close confirmation
      setShowFeedbackModal(true); // Show feedback
    } catch (error) {
      console.error('Error deleting songs:', error);
      setShowConfirmModal(false);
      // Optionally you could show an error modal here
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center card-title mb-4">Admin Dashboard</h2>

      <Row className="justify-content-center">
        {/* Manage Songs Card */}
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="card-title">Manage Songs</h5>
              <p className="card-text">Clear all songs from the database.</p>
              <Row>
                <Col>
                  <Button variant="danger" onClick={() => setShowConfirmModal(true)} block>
                    Clear Songs
                  </Button>
                </Col>
                <Col>
                  <Link to="/ViewSongsAdmin">
                    <Button className="btnSpace">Song List</Button>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Other Admin Cards */}
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="card-title">View PR</h5>
              <p className="card-text">View and manage PR records.</p>
              <Link to="/ViewPRAdmin">
                <Button variant="primary" block>
                  View PR
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="card-title">View Users</h5>
              <p className="card-text">Manage users and their roles.</p>
              <Link to="/ViewUsersAdmin">
                <Button variant="success" block>
                  View Users
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="card-title">Create Event</h5>
              <p className="card-text">Create a new event for your platform.</p>
              <Row>
                <Col>
                  <Link to="/CreateEvent">
                    <Button variant="warning" block>
                      Create Event
                    </Button>
                  </Link>
                </Col>
                <Col>
                  <Link to="/ViewEventsAdmin">
                    <Button block>
                      View Events
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete all songs?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete All
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Deletion Complete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deletedCount > 0
            ? `${deletedCount} song${deletedCount !== 1 ? 's' : ''} deleted successfully.`
            : 'No songs were deleted.'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowFeedbackModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminDashboard;
