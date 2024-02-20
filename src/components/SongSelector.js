import React, { useEffect, useState } from "react";
import { Wheel } from 'react-custom-roulette'
import Axios from 'axios';

function SongSelector() {
    /*useEffect(() => {
        setList(fetchList());
        console.log(List);
    }, []);
    const [List, setList] = useState([]);
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const data = [
        { option: '0' },
        { option: '1' },
        { option: '2' },
    ]

    const handleSpinClick = () => {
        if (!mustSpin) {
            const newPrizeNumber = Math.floor(Math.random() * data.length);
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);
        }
    }
    const fetchList = async () => {
        var result = await Axios.get(`http://192.168.1.149:3001/getVids`)
            .then((response) => {
                //console.log(response.data[0].VideoTitle);
                setList(response.data[0].VideoTitle);
            });
        return result.data[0].VideoTitle;
        //const lists = data.data;
        //console.log(List);
    };

    function chooseRandomSong() {
        var length = List.length;
        var random = Math.random();
        console.log("length: " + length);
        console.log("Random Num: " + random);
        console.log("List item: " + List[0]);
        return List[Math.floor(length * random)]
    }*/



    return (
        <div>
            {/* <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}

                onStopSpinning={() => {
                    setMustSpin(false);
                }}
            />
            <button onClick={handleSpinClick}>SPIN</button> */}
            <iframe src="https://wheeldecide.com/e.php?" width="500" height="500"></iframe>
        </div >
    )
}


export default SongSelector;