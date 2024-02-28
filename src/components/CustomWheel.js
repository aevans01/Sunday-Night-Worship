import { Wheel } from 'react-custom-roulette'
import { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Axios from 'axios';
import VideoDetail from './VideoDetail';
import { Alert } from 'bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const CustomWheel = (wheelData) =>{
    const [data, setData] = useState(wheelData);
    const [Winner, setWinner] = useState();
    const[WinnerURL,setWinnerURL] = useState();
    const [List, setList] = useState([]);
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refresh,setRefresh] = useState(0);

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => setShow(true);

    useEffect(() => {
        Axios.get(`/getVids`)
            .then((response) => {
                if(response.data){
                    setList(response.data)
                    
                    wheelData = response.data.map((item) => {
                        return{
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
    const fetchList =  () => {
        
    };
    
    const handleSpinClick = () => {
        if (!mustSpin) {
            const newPrizeNumber = Math.floor(Math.random() * List.length);
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true); 
        }
    }
    function refreshWheel(){
         setLoading(false);
    }

return(<div className='background'>
<button onClick={refreshWheel}>Load Wheel</button>
    {loading ? (<p>Loading...</p>) :
    
             (<div className='wheel'><Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                backgroundColors={['red','purple','yellow','blue','green']}
                onStopSpinning={() => {
                    setMustSpin(false);
                    setWinner(List[prizeNumber].VideoTitle)
                    setWinnerURL(List[prizeNumber].VideoSource)
                    handleShow();
                    data.splice(prizeNumber,prizeNumber);
                }} 
            />
            <button onClick={handleSpinClick}>SPIN</button> 
            <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{Winner}</Modal.Title>
        </Modal.Header>
        <Modal.Body><div className='modalImg'><a href={WinnerURL}><img src={List[prizeNumber].VideoImage}/></a></div></Modal.Body>
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