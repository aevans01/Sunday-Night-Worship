import React from 'react';
import SearchBar from './components/SearchBar';
import youtube from './youtube';
import VideoList from './components/VideoList';
import VideoDetail from './components/VideoDetail';
import { useNavigate } from "react-router-dom";

class App extends React.Component {
    
    state = {
        videos: [],
        selectedVideo: null,
        ipAddr: 'https://192.168.1.149:3001'
    }
    handleSubmit = async (termFromSearchBar) => {
        const response = await youtube.get('/search', {
            params: {
                q: termFromSearchBar
            }
        })
        this.setState({
            videos: response.data.items
        })
    };
    handleVideoSelect = (video) => {
        const navigate = useNavigate();
        this.setState({selectedVideo: video})
        {navigate("./Hat")}
    }

    render() {
        return (
            
            <div className='ui container' style={{marginTop: '1em'}}>
                <SearchBar handleFormSubmit={this.handleSubmit}/>
                <div className='ui grid'>
                    <div className="ui row">
                        <div className="eleven wide column">
                            <VideoDetail video={this.state.selectedVideo}/>
                        </div>
                        <div className="five wide column">
                            <VideoList handleVideoSelect={this.handleVideoSelect} videos={this.state.videos}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;