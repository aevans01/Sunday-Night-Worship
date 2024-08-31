import React from 'react';
import youtube from './youtube';
import Home from './components/Home';
import Hat from './components/Hat';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/App.css';
import { Navigate, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SongSelector from './components/SongSelector';
import SongPicker from './components/SongPicker';
import AdminError from './components/AdminError'
import AdminLogin from './components/AdminLogin';
import Suggestion from './components/Suggestion';
import Register from './components/Register';
import Layout from './layout/Layout';

class App extends React.Component {

    render() {
        return (
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Suggestions" element={<Suggestion />} />
                    <Route path="/SongPicker" element={<SongPicker />} />
                    <Route path="/SongSelector" element={<SongSelector />} />
                    <Route path='/Register' element={<Register />} />
                    <Route path='Login-Admin' element={<AdminLogin />} />
                    <Route path="*" element={<AdminError />} />
                </Routes>
            </Layout>
        )
    }
}

export default App;