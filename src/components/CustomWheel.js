import { Wheel } from 'react-custom-roulette'
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Axios from 'axios';
import VideoDetail from './VideoDetail';
import { Alert } from 'bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const CustomWheel = (wheelData) => {
    const [data, setData] = useState(wheelData);
    const [Winner, setWinner] = useState();
    const [WinnerURL, setWinnerURL] = useState();
    const [List, setList] = useState([]);
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => setShow(true);

    useEffect(() => {
        Axios.get(`https://hhbc-snw-api.netlify.app/api/getSongs`)
            .then((response) => {
                if (response.data) {
                    setList(response.data)

                    wheelData = response.data.map((item) => {
                        return {
                            option: item.VideoTitleShortened
                        }
                    })
                    setData(wheelData);
                }
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [wheelData]);
    const fetchList = () => {

    };

    const handleSpinClick = () => {
        if (!mustSpin) {
            const newPrizeNumber = Math.floor(Math.random() * List.length);
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);
        }
    }
    function refreshWheel() {
        setLoading(false);
    }

    return (<div className='background'>
        <button onClick={refreshWheel}>Load Wheel</button>
        {loading ? (<p>Loading...</p>) :

            (<div className='wheel'><Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
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
                onStopSpinning={() => {
                    setMustSpin(false);
                    setWinner(List[prizeNumber].VideoTitle)
                    setWinnerURL(List[prizeNumber].VideoSource)
                    handleShow();
                    data.splice(prizeNumber, prizeNumber);
                }}
            />
                <button onClick={handleSpinClick}>SPIN</button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{Winner}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><div className='modalImg'><a href={"https://www.youtube.com/watch?v=" + WinnerURL}><img src={List[prizeNumber].VideoImage} /></a></div></Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>)
        }
    </div>

    )
}
export default CustomWheel;