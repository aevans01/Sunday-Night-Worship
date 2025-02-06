import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap'; // Import Bootstrap components

const PhotoAlbum = () => {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await fetch('https://hhbc-snw-api.netlify.app/api/getPhotos');
                const data = await response.json();
                setPhotos(data);
            } catch (error) {
                console.error('Error fetching photos:', error);
            }
        };

        fetchPhotos();
    }, []);

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Photo Gallery</h2>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {photos.map((photo, index) => (
                    <Col key={index}>
                        <Card className="shadow-sm border-0">
                            <Card.Img
                                variant="top"
                                src={`data:image/jpeg;base64,${photo.image_data}`}
                                alt={photo.filename}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Text className="text-center">{photo.filename}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default PhotoAlbum;
