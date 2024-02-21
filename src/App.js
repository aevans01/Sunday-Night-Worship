import React from 'react';
import youtube from './youtube';
import Home from './components/Home';
import Hat from './components/Hat';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/App.css';
import { Navigate, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SongSelector from './components/SongSelector';
import AdminError from './components/AdminError'
import AdminLogin from './components/AdminLogin';

class App extends React.Component {

    render() {
        return (
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Hat" element={<Hat />} />
                    <Route path="/SongSelector" element={<SongSelector />} />
                    <Route path='Login-Admin' element={<AdminLogin/>}/>
                    <Route path="*" element={<AdminError/>}/>
                </Routes>
            </div>
        )
    }
}

export default App;