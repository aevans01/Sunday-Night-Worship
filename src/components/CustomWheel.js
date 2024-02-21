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
        Axios.get(`http://192.168.1.149:3001/getVids`)
            .then((response) => {
                if(response.data){
                    setList(response.data)
                    
                    wheelData = response.data.map((item) => {
                        return{
                            option: item.VideoTitleShortened
                        }
                    })
                    console.log(wheelData);
                    setData(wheelData);
                    console.log(data);
                }
                
                //setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
              });
              
        loadData();
    }, [wheelData]);  
    const fetchList =  () => {
        
    };

    function loadData(){
        // console.log(List);
        // data.pop();
        // console.log("before ForEach: ");
        // console.log(data);
        // List.forEach((element) => {
        //     data.forEach((item) => {
        //         item.option = element.VideoTitleShortened;
        //     })
            
        // })
        
        // console.log(data);
    }
    
    const handleSpinClick = () => {
        if (!mustSpin) {
            const newPrizeNumber = Math.floor(Math.random() * List.length);
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true); 
        }
    }
    function refreshWheel(){
        console.log(data);
        //setLoading(true);
         //loadData();
         setLoading(false);
         //setRefresh(refresh+1);
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
                    console.log("WINNER: " + List[prizeNumber].VideoSource);
                    setMustSpin(false);
                    setWinner(List[prizeNumber].VideoTitle)
                    console.log(Winner);
                    setWinnerURL(List[prizeNumber].VideoSource)
                    handleShow();
                    data.splice(prizeNumber,prizeNumber);
                    //alert("WINNER: " + List[prizeNumber].VideoTitle +" Link: " +List[prizeNumber].VideoSource);
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