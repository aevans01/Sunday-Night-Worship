import 'bootstrap/dist/css/bootstrap.min.css';
import './style/App.css';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import ProtectedRoute from './ProtectedRoute';
import Layout from './layout/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ViewProfile from './components/ViewProfile';
import EditProfile from './components/EditProfile';
import CreatePrayerRequest from './components/CreatePrayerRequest';
import ViewPrayerRequests from './components/ViewPrayerRequests';
import PhotoAlbum from './components/PhotoAlbum';
import PhotoUpload from './components/PhotoUpload';
import Events from './components/Events';
import CreateEvent from './components/CreateEvent';
import SongPicker from './components/SongPicker';
import SongSelector from './components/SongSelector';
import AdminDashboard from './components/AdminDashboard';
import ViewSongsAdmin from './components/ViewSongsAdmin';
import ViewPRAdmin from './components/ViewPRAdmin';
import ViewUsersAdmin from './components/ViewUsersAdmin';
import ViewEventsAdmin from './components/ViewEventsAdmin';
import ViewAttendees from './components/ViewAttendees';
import AdminError from './components/AdminError';
const admin = Component => <ProtectedRoute roles={['1']}><Component /></ProtectedRoute>;
const member = Component => <ProtectedRoute roles={['0', '1']}><Component /></ProtectedRoute>;
export default function App() {
  return <UserProvider><Layout><Routes>
        <Route path="/" element={<Home />} /><Route path="/Login" element={<Login />} /><Route path="/Register" element={<Register />} />
        <Route path="/ViewProfile" element={member(ViewProfile)} /><Route path="/EditProfile" element={member(EditProfile)} />
        <Route path="/ViewPrayerRequests" element={<ViewPrayerRequests />} /><Route path="/CreatePrayerRequest" element={<CreatePrayerRequest />} />
        <Route path="/PhotoAlbum" element={<PhotoAlbum />} /><Route path="/UploadPhotos" element={member(PhotoUpload)} /><Route path="/Events" element={<Events />} /><Route path="/SongPicker" element={<SongPicker />} />
        <Route path="/SongSelector" element={admin(SongSelector)} /><Route path="/AdminDashboard" element={admin(AdminDashboard)} /><Route path="/ViewSongsAdmin" element={admin(ViewSongsAdmin)} /><Route path="/ViewPRAdmin" element={admin(ViewPRAdmin)} /><Route path="/ViewUsersAdmin" element={admin(ViewUsersAdmin)} /><Route path="/ViewEventsAdmin" element={admin(ViewEventsAdmin)} /><Route path="/CreateEvent" element={admin(CreateEvent)} /><Route path="/ViewAttendees" element={admin(ViewAttendees)} /><Route path="/AdminError" element={<AdminError />} /><Route path="*" element={<AdminError />} />
      </Routes></Layout></UserProvider>;
}
