import React from 'react';


function Hat() {
    console.log(`Added song to the "hat"`)
    return (
        <div className='hat'>
            <div>Song Added To List!</div>
            <div><a href='/'>Click here to return to Home Page</a></div>
        </div>
    )

}

export default Hat;