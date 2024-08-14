import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../style/video.css';
import redX from "../images/redX.png"
import check from "../images/Check.png"
import Hat from './Hat';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const VideoItem = ({ video, handleVideoSelect }) => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClose = (e) => {e.preventDefault(); setShow(false); navigate("/"); }
    const handleShow = () => setShow(true);
    const [modalText, setModalText] = useState("");
    const [modalImg, setModalImg] = useState("");

    return (
        <div onClick={(e) => {
            e.preventDefault();
            Axios.post(`https://hhbc-snw-api.netlify.app/api/addSongs`, {
                VideoSource: video.id.videoId,
                VideoTitle: video.snippet.title,
                VideoTitleShortened: video.snippet.title,
                VideoDescription: video.snippet.description,
                VideoImage: video.snippet.thumbnails.medium.url,

            }).then((results) => {
                handleShow();
                if (results.data) {
                    setModalText("Song Added Click Close To Return Home");
                    setModalImg(check);
                } else {
                    setModalText("ERROR Could Not Add Song. Please Try Again In A Minute.");
                    setModalImg(redX);
                }
            })
        }
        }
            className=' video-item item'>
            <img className='ui image' src={video.snippet.thumbnails.medium.url} alt={video.snippet.description} />
            <div className='content'>
                <div className='header '>{video.snippet.title}</div>
            </div>
            <Modal centered show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title id='modalTitle'>{video.snippet.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body id='modalTitle'><div className='modalImg'><p>{modalText}</p><img src={modalImg} /></div></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
};
export default VideoItem;