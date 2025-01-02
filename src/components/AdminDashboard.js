import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
function AdminDashboard() {
  return (
    <div className='center'>
      <Button>Clear Songs</Button><br /><br />
      <Button>View PR</Button><br /><br />
      <Button>View Users</Button><br />
    </div>
  )
}

export default AdminDashboard;