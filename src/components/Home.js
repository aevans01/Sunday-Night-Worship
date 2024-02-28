import React from 'react';
import SearchBar from './SearchBar';
import youtube from '../youtube';
import VideoList from './VideoList';
import VideoDetail from './VideoDetail';
import { useNavigate } from "react-router-dom";

class Home extends React.Component {

    state = {
        videos: [],
        selectedVideo: null
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
        this.setState({ selectedVideo: video })
        { navigate("./Hat") }
    }

    render() {
        return (
            
            <div className='ui container' style={{ marginTop: '1em' }}>
                <SearchBar handleFormSubmit={this.handleSubmit} />
                <div className='reminder'>Make sure it has lyrics!!</div>
                <div className='suggestions'><a href=''>Have a suggestion to make this better?</a></div>
                <div className='ui grid'>
                    <div className="ui row">
                        <div className="eleven wide column">
                            <VideoDetail video={this.state.selectedVideo} />
                        </div>
                        <div className="five wide column">
                            <VideoList handleVideoSelect={this.handleVideoSelect} videos={this.state.videos} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;