import Carousel from 'react-bootstrap/Carousel';
import Img1 from '../images/YouthGroup.jpg';
import Img2 from '../images/YouthCamp.jpg';
import Img3 from '../images/YouthPraying.jpg';
import { Button, Container } from 'react-bootstrap';

function Home() {
    return (
        <>
            {/* Carousel Section */}
            <Carousel>
                <Carousel.Item>
                    <img src={Img1} alt="Youth Group" className="d-block carousel-img" />
                    <Carousel.Caption>
                        <h3 className="display-4">Building Community</h3>
                        <p className="lead gray">Join our Youth Group for meaningful connections and growth.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src={Img2} alt="Youth Camp" className="d-block carousel-img" />
                    <Carousel.Caption>
                        <h3 className="display-4">Youth Camp Adventures</h3>
                        <p className="lead gray">Explore new horizons and experience life-changing moments at Youth Camp.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src={Img3} alt="Youth Praying" className="d-block carousel-img" />
                    <Carousel.Caption>
                        <h3 className="display-4">Power of Prayer</h3>
                        <p className="lead gray">Together, we grow in faith through the power of prayer and community.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            {/* Welcome Section */}
            <Container className="text-center mt-5">
                <div className="p-4 bg-dark text-white rounded shadow">
                    <h1 className="display-3 mb-4">Welcome to Haven Heights Baptist Church!</h1>
                    <p className="lead mb-4">
                        Join us on our mission to grow in faith, serve our community, and experience God’s love.
                    </p>
                    <Button variant="primary" size="lg" href="/check-in" className="px-4 py-2">
                        Check In
                    </Button>
                </div>
            </Container>
        </>
    );
}

export default Home;
