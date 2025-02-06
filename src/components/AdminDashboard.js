import Axios from "axios";
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap'; // Importing necessary components

function AdminDashboard() {
  // Function to clear songs
  function clearSongs() {
    Axios.post(`https://hhbc-snw-api.netlify.app/api/deleteSongs`);
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      <Row className="justify-content-center">
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="card-title">Manage Songs</h5>
              <p className="card-text">Clear all songs from the database.</p>
              <Button variant="danger" onClick={clearSongs} block>
                Clear Songs
              </Button>
            </Card.Body>
          </Card>
        </Col>

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
              <p style={{ color: 'red' }}>DOESNT WORK YET</p>
              <h5 className="card-title">Create Event</h5>
              <p className="card-text">Create a new event for your platform.</p>
              <Link to="/CreateEvent">
                <Button variant="warning" block>
                  Create Event
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;
