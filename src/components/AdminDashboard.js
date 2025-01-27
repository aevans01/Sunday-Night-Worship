import Axios from "axios";
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
function AdminDashboard() {
  function clearSongs() {
    Axios.post(`https://hhbc-snw-api.netlify.app/api/deleteSongs`)
  }
  return (
    <div className='center'>
      {/* <Button onClick={clearSongs()}>Clear Songs</Button><br /><br /> */}
      <Link to="/ViewPRAdmin">
        <Button>View PR</Button><br /><br />
      </Link>
      <Link to="/ViewUsersAdmin">
        <Button>View Users</Button><br />
      </Link>
    </div>
  )
}

export default AdminDashboard;