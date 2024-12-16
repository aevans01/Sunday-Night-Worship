import { Wheel } from 'react-custom-roulette';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Button, Modal } from 'react-bootstrap';

const CustomWheel = () => {
    const [data, setData] = useState([]);  // Store wheel data
    const [List, setList] = useState([]);  // Store song list
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [winner, setWinner] = useState('');
    const [winnerURL, setWinnerURL] = useState('');

    // Use an effect that runs only once on component mount to fetch songs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get(`https://hhbc-snw-api.netlify.app/api/getSongs`);
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

    // Handle spin click (should trigger only once and safely update the state)
    const handleSpinClick = () => {
        if (!mustSpin) {
            setMustSpin(true);  // Start spinning
            const newSpinAngle = Math.floor(Math.random() * 360) + 1440;  // 4 rotations
            setPrizeNumber(Math.floor(Math.random() * List.length));  // Random prize number
            setTimeout(() => {
                setMustSpin(false);  // Stop spinning after timeout
            }, 3000);  // 3 seconds to spin
        }
    };

    // Handle when the wheel stops spinning
    const handleStopSpinning = () => {
        if (data && data[prizeNumber]) {
            setWinner(data[prizeNumber].option);  // Set winner based on prize number
            setWinnerURL(List[prizeNumber].VideoSource);  // Set winner URL
            setShow(true);  // Show winner modal
            window.open(`https://www.youtube.com/watch?v=${List[prizeNumber].VideoSource}`);  // Open YouTube link
        }
    };

    // Handle closing of modal
    const handleClose = () => setShow(false);

    return (
        <div className="background">
            <button onClick={() => setLoading(false)}>Load Wheel</button>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="wheel">
                    <Wheel
                        mustStartSpinning={mustSpin}
                        prizeNumber={prizeNumber}
                        data={data}
                        onStopSpinning={handleStopSpinning}
                        backgroundColors={['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
                            '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                            '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                            '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                            '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                            '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                            '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                            '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                            '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                            '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']}
                    />
                    <button onClick={handleSpinClick}>SPIN</button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{winner}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="modalImg">
                                <a href={`https://www.youtube.com/watch?v=${List[prizeNumber].VideoSource}`}>
                                    <img src={List[prizeNumber].VideoImage} alt="Video Thumbnail" />
                                </a>
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
