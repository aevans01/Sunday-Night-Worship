import React from 'react';
import { Card, Button, Col, Row, Container } from 'react-bootstrap';
import Axios from 'axios';
import { use } from 'react';

const [attendees, setAttendees] = useState([]);

useEffect(() => {
    const fetchAttendees = async () => {
        try {
            const response = await Axios.post('https://hhbc-snw-api.netlify.app/api/getAttendees', {
                eventId: eventId,
            });
            setAttendees(response.data);
        } catch (error) {
            console.error('Error fetching attendees:', error);
        }
    };

    fetchAttendees();
}, [eventId]);


function ViewAttendees() {
    return (
        <div>
            <h2>View Attendees Page</h2>
            {/* Add your code to display attendees here */}
        </div>
    );
}

export default ViewAttendees;