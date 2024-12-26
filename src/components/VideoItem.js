import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import redX from "../images/redX.png";
import check from "../images/Check.png";
import Axios from 'axios';

const VideoItem = ({ video, handleVideoSelect }) => {
    const [show, setShow] = useState(false);
    const [modalText, setModalText] = useState("");
    const [modalImg, setModalImg] = useState("");
    const [isLoading, setIsLoading] = useState(false); // New state for loading
    const [isDuplicate, setIsDuplicate] = useState(false); // To track if the video has already been added

    const handleClose = () => {
        setShow(false);
        window.location.reload();
    };

    const handleShow = () => setShow(true);

    const checkIfVideoExists = async (videoId) => {
        try {
            const response = await Axios.get(`https://hhbc-snw-api.netlify.app/api/checkSongExists?videoId=${videoId}`);
            return response.data.exists; // Assuming the API returns a boolean indicating if the song exists
        } catch (error) {
            console.error('Error checking if video exists', error);
            return false;
        }
    };

    const handleVideoClick = async (e) => {
        e.preventDefault();

        if (isLoading) return; // Prevent further clicks if a request is in progress

        setIsLoading(true); // Start loading state to disable further clicks

        // Check if the video already exists in the database before inserting
        // const videoExists = await checkIfVideoExists(video.id.videoId);
        // if (videoExists) {
        //     setIsDuplicate(true);
        //     setModalText("This song has already been added.");
        //     setModalImg(redX);
        //     setShow(true);
        //     setIsLoading(false); // End loading state
        //     return;
        // }

        // Proceed to add the song if it's not a duplicate
        Axios.post(`http://localhost:3001/api/addSongs`, {
            VideoSource: video.id.videoId,
            VideoTitle: video.snippet.title,
            VideoTitleShortened: video.snippet.title,
            VideoDescription: video.snippet.description,
            VideoImage: video.snippet.thumbnails.medium.url,
        }).then((results) => {
            handleShow();
            if (results.data) {
                setModalText("Song Added! Click Close to Return Home.");
                setModalImg(check);
            } else {
                setModalText("ERROR: Could not add song. Please try again in a minute.");
                setModalImg(redX);
            }
            setIsLoading(false); // End loading state
        }).catch((err) => {
            setModalText("ERROR: Could not add song. Please try again later.");
            setModalImg(redX);
            setIsLoading(false); // End loading state
        });
    };

    return (
        <div onClick={handleVideoClick} className={`video-item item ${isLoading ? 'disabled' : ''}`}>
            <div className="video-thumbnail-container">
                <img className="video-thumbnail" src={video.snippet.thumbnails.medium.url} alt={video.snippet.description} />
                <div className='content'>
                    <div className='header'>{video.snippet.title}</div>
                </div>
            </div>

            <Modal centered show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title id='modalTitle'>{video.snippet.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body id='modalTitle'>
                    <div className='modalImg'>
                        <p>{modalText}</p>
                        <img src={modalImg} alt="Modal Image" />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default VideoItem;
