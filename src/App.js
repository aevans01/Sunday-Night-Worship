import React from 'react';
import youtube from './youtube';
import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/App.css';
import { Navigate, Route, Routes } from "react-router-dom";
import SongSelector from './components/SongSelector';
import SongPicker from './components/SongPicker';
import AdminError from './components/AdminError';
import AdminLogin from './components/AdminLogin';
import Register from './components/Register';
import Layout from './layout/Layout';
import CreatePrayerRequest from './components/CreatePrayerRequest';
import ViewPrayerRequests from './components/ViewPrayerRequests';
import Login from './components/Login';
import { UserProvider } from './UserContext';
import ProtectedRoute from './ProtectedRoute';
import ViewProfile from './components/ViewProfile';

class App extends React.Component {
    render() {
        return (
            <UserProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/SongSelector" element={
                            <ProtectedRoute roles={["1"]}>
                                <SongSelector/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/SongPicker" element={<SongPicker />} />
                        <Route path="/Login" element={<Login />} />
                        {/* <Route path="/SongSelector" element={<SongSelector/>
                           <ProtectedRoute roles={['admin', 'user']}>
                                <SongSelector />
                            </ProtectedRoute>
                        } /> */}
                        <Route path='/Register' element={<Register />} />
                        <Route path='/CreatePrayerRequest' element={<CreatePrayerRequest />} />
                        <Route path='/ViewProfile' element={<ViewProfile/>}/>
                        <Route path='/ViewPrayerRequests' element={<ViewPrayerRequests/>
                        
                          /*  <ProtectedRoute roles={['admin']}>
                                <ViewPrayerRequests />
                            </ProtectedRoute>*/
                        } />
                        <Route path="*" element={<AdminError />} />
                    </Routes>
                </Layout>
            </UserProvider>
        );
    }
}

export default App;
