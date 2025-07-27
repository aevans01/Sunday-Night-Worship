import Carousel from 'react-bootstrap/Carousel';
import Img1 from '../images/YouthGroup.jpg';
import Img2 from '../images/YouthCamp.jpg';
import Img3 from '../images/YouthPraying.jpg';
import Img4 from '../images/YouthCamp2025.jpg';
import Img5 from '../images/YouthCamp2025-1.jpg';
import Img6 from '../images/YouthCamp2025-2.jpg';
import Img7 from '../images/YouthCamp2025-3.jpg';
import Img8 from '../images/YouthCamp2025-4.jpg';
import Img9 from '../images/YouthCamp2025-5.jpg';
import Img10 from '../images/YouthCamp2025-6.jpg';
import Img11 from '../images/YouthCamp2025-7.jpg';
import Img12 from '../images/YouthCamp2025-8.jpg';
import Img13 from '../images/YouthCamp2025-9.jpg';
import Img14 from '../images/YouthCamp2025-10.jpg';
import Img15 from '../images/YouthCamp2025-11.jpg';
import Img16 from '../images/YouthCamp2025-12.jpg';
import Img17 from '../images/YouthCamp2025-13.jpg';

import { Button, Container } from 'react-bootstrap';
// import DailyBibleVerse from './DailyBibleVerse';
// const YouVersion = require("@glowstudent/youversion");

function Home() {
    // async function test() {
    //     var verse = await YouVersion.getVerseOfTheDay("en", "KJV");
    //     console.log(verse)
    // }
    return (
        <>
            {/* Carousel Section */}
            <Carousel fade interval={4000} className="carousel-container">
                <Carousel.Item>
                    <img src={Img4} alt="Youth Praying" className="d-block carousel-img" />
                </Carousel.Item>
                <Carousel.Item>
                    <img src={Img5} alt="Youth Praying" className="d-block carousel-img" />
                </Carousel.Item><Carousel.Item>
                    <img src={Img6} alt="Youth Praying" className="d-block carousel-img" />
                </Carousel.Item><Carousel.Item>
                    <img src={Img7} alt="Youth Praying" className="d-block carousel-img" />
                </Carousel.Item><Carousel.Item>
                    <img src={Img8} alt="Youth Praying" className="d-block carousel-img" />
                </Carousel.Item><Carousel.Item>
                    <img src={Img9} alt="Youth Praying" className="d-block carousel-img" />
                </Carousel.Item><Carousel.Item>
                    <img src={Img10} alt="Youth Praying" className="d-block carousel-img" />
                </Carousel.Item><Carousel.Item>
                    <img src={Img11} alt="Youth Praying" className="d-block carousel-img" />
                </Carousel.Item><Carousel.Item>
                    <img src={Img12} alt="Youth Praying" className="d-block carousel-img" />
                </Carousel.Item><Carousel.Item>
                    <img src={Img13} alt="Youth Praying" className="d-block carousel-img" />
                </Carousel.Item><Carousel.Item>
                    <img src={Img14} alt="Youth Praying" className="d-block carousel-img" />
                </Carousel.Item><Carousel.Item>
                    <img src={Img15} alt="Youth Praying" className="d-block carousel-img" />
                </Carousel.Item><Carousel.Item>
                    <img src={Img16} alt="Youth Praying" className="d-block carousel-img" />
                </Carousel.Item><Carousel.Item>
                    <img src={Img17} alt="Youth Praying" className="d-block carousel-img" />
                </Carousel.Item>
            </Carousel>

            {/* Welcome Section */}
            <Container className="text-center mt-5">
                <div className="p-4 bg-dark text-white rounded shadow">
                    <h1 className="display-3 mb-4">Welcome to Haven Heights Baptist Church!</h1>
                    <p className="lead mb-4">
                        Join us on our mission to grow in faith, serve our community, and experience God’s love.
                    </p>
                    <h4>Service Meeting Times</h4>
                    <ul className="list-unstyled">Sunday
                        <li>Sunday School (we have classes for all ages): 9:30 AM</li>
                        <li>Morning Service: 10:45 AM</li>
                        <li>Evening Service: 6:30 PM</li>
                    </ul>
                    <ul className="list-unstyled">Wednesday
                        <li>Prayer Meeting: 6:30 PM</li>
                    </ul>
                    <div className="mt-4">
                        <h1 className="text-decoration-underline">Announcements</h1>

                    </div>



                    {/* <Button variant="primary" size="lg" href="/check-in" className="px-4 py-2">
                        Check In
                    </Button> */}
                    {/* <div className='dailyVerseDiv'>
                        <DailyBibleVerse />
                    </div> */}
                </div>
            </Container>
        </>
    );
}

export default Home;
