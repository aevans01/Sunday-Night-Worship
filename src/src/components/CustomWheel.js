import { Wheel } from 'react-custom-roulette';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Button, Modal, Spinner } from 'react-bootstrap';

const CustomWheel = () => {
    const [data, setData] = useState([]);  // Store wheel data
    const [List, setList] = useState([]);  // Store song list
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [, setWinner] = useState('');
    const [winnerURL, setWinnerURL] = useState('');
    const [, setWinnerImg] = useState('');
    const [spinning, setSpinning] = useState(false);  // Added state for controlling spinning process

    // Use an effect that runs only once on component mount to fetch songs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get(`/api/getSongs`);
                if (response.data) {
                    setList(response.data);  // Store songs in List
                    const updatedWheelData = response.data.map(item => ({
                        option: item.VideoTitleShortened
                    }));
                    setData(updatedWheelData);  // Set wheel data
                    setLoading(false);  // Mark loading as false once data is loaded
                }
            } catch (error) {
                console.error(error);
                setLoading(false);  // Stop loading if there is an error
            }
        };

        fetchData();  // Fetch data only once
    }, []);  // Empty dependency array to run the effect only once

    // useEffect(() => {
    //     if (!mustSpin) {
    //         handleStopSpinning();
    //     }
    // }, [mustSpin]);

    // Handle spin click (should trigger only once and safely update the state)
    const handleSpinClick = () => {
        if (!mustSpin && data.length > 0 && !spinning) {  // Prevent starting spin if already spinning
            setMustSpin(true);  // Start spinning
            setSpinning(true);  // Set spinning state to true
            const newPrizeNumber = Math.floor(Math.random() * data.length);  // Recalculate prize number based on remaining options
            setPrizeNumber(newPrizeNumber);  // Set the new prize number
            //     setTimeout(() => {
            //         setMustSpin(false);  // Stop spinning after timeout
            //     }, 0);  // 3 seconds to spin
        }
    };

    // Handle when the wheel stops spinning
    const handleStopSpinning = () => {
        console.log("Wheel stopped!");
        console.log("Prize number:", prizeNumber);
        console.log("Winner:", data[prizeNumber]?.option);
        if (data.length > 0 && List.length > 0) {
            // Store the exact winner BEFORE modifying data
            const selectedItem = List.find(item => item.VideoTitleShortened === data[prizeNumber].option);

            if (selectedItem) {
                setWinner(selectedItem.VideoTitleShortened); // Set the correct winner name
                setWinnerURL(selectedItem.VideoSource); // Set the correct winner's video source
                setWinnerImg(selectedItem.VideoImage);  // Set winner image
                setShow(true);  // Show winner modal
                //window.open(`https://www.youtube.com/watch?v=${List[prizeNumber].VideoSource}`);  // Open YouTube link

                // Remove the chosen winner from the wheel data
                const updatedData = data.filter((_, index) => index !== prizeNumber);  // Filter out the winner
                setData(updatedData);  // Update wheel data to remove the winner

                // Ensure the prizeNumber is still within bounds after updating data
                if (updatedData.length > 0) {
                    // If the array is not empty, recalculate a valid prize number
                    setPrizeNumber(Math.floor(Math.random() * updatedData.length));
                } else {
                    // If no data left, reset to initial state
                    setPrizeNumber(0);
                }
            }

            setSpinning(false);  // Reset spinning state after the spin is complete
            setMustSpin(false);  // Reset mustSpin state after the spin is complete
        }
    };

    // Handle closing of modal
    const handleClose = () => setShow(false);

    return (
        <div className="background">
            {loading ? (
                <div className="loading-container">
                    <Spinner animation="border" variant="primary" />
                    <p>Loading songs...</p>
                </div>
            ) : data.length === 0 ? (<div className="portal-empty"><h2>No songs left to spin.</h2><p>Add songs to the list to get started.</p></div>) : (
                <div className="wheel-container">
                    <Wheel
                        mustStartSpinning={mustSpin}
                        prizeNumber={prizeNumber}
                        data={data}
                        onStopSpinning={handleStopSpinning}
                        backgroundColors={['#dce8d7','#edf1eb','#c9d7c2','#e8d8b5','#d5e1db']}
                        textColors={['#182c35']}
                    />
                    <Button
                        variant="primary"
                        size="lg"
                        className="spin-btn"
                        onClick={handleSpinClick}
                        disabled={mustSpin || data.length === 0 || spinning}  // Disable button during spinning
                    >
                        Spin the Wheel
                    </Button>
                    <Modal show={show} onHide={handleClose} centered size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>{List.find(item => item.VideoSource === winnerURL)?.VideoTitle}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="modal-content">
                                <div className="modal-image-container">
                                    <a href={`https://www.youtube.com/watch?v=${winnerURL}`} target="_blank" rel="noopener noreferrer">
                                        <img src={List.find(item => item.VideoSource === winnerURL)?.VideoImage}
                                            alt="Video Thumbnail" className="img-fluid" />
                                    </a>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default CustomWheel;
