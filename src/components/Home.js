import Carousel from 'react-bootstrap/Carousel';
import Img1 from '../images/YouthGroup.jpg';
import Img2 from '../images/YouthCamp.jpg';
import Img3 from '../images/YouthPraying.jpg';

function Home() {
    return (
        <>
            <Carousel>
                <Carousel.Item>
                    <img src={Img1} className='w-40 h-50 center' />
                    <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src={Img2} className='w-40 h-50 center' />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src={Img3} className='w-40 h-50 center' />
                    <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>
                            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </>
    )
}

export default Home;