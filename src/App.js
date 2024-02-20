import React from 'react';
import youtube from './youtube';
import Home from './components/Home';
import Hat from './components/Hat';
import { Navigate, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SongSelector from './components/SongSelector';

class App extends React.Component {

    render() {
        return (
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Hat" element={<Hat />} />
                    <Route path="/SongSelector" element={<SongSelector />} />
                </Routes>
            </div>
        )
    }
}

export default App;