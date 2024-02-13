import React, { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../style/video.css';
import Hat from './Hat';
import Axios from 'axios';


const VideoItem = ({video , handleVideoSelect}) => {
    const navigate = useNavigate();
    return (
        <div onClick={ () =>  {Axios.post(`http://192.168.1.149:3001/insertVids`, {
            VideoSource: video.id.videoId,
            VideoTitle: video.snippet.title,
            VideoDescription: video.snippet.description,
            VideoImage: video.snippet.thumbnails.medium.url,
        }).then((results)=> {
            {navigate("./Hat")}
        })}
    } 
    className=' video-item item'>
            <img className='ui image' src={video.snippet.thumbnails.medium.url} alt={video.snippet.description}/>
            <div className='content'>
                <div className='header '>{video.snippet.title}</div>
            </div>
        </div>
    )
};
export default VideoItem;