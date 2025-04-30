import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Card, Form, Button, Modal,
    Carousel, DropdownButton, Dropdown, Toast, ToastContainer
} from 'react-bootstrap';
import Axios from 'axios';
import '../style/PhotoAlbum.css';

const PhotoAlbum = () => {
    const [albums, setAlbums] = useState([]);
    const [albumName, setAlbumName] = useState('');
    const [uncategorizedPhotos, setUncategorizedPhotos] = useState([]);
    const [showCarousel, setShowCarousel] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [currentAlbumPhotos, setCurrentAlbumPhotos] = useState([]);

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');

    useEffect(() => {
        const fetchAlbumsAndPhotos = async () => {
            try {
                const albumResponse = await Axios.get('https://hhbc-snw-api.netlify.app/api/getPhotoAlbum');
                const albumsData = albumResponse.data;

                const photoResponse = await Axios.get('https://hhbc-snw-api.netlify.app/api/getPhotos');
                const photosData = photoResponse.data;

                const uncategorized = photosData.filter(photo => !photo.album);

                const updatedAlbums = albumsData.map(album => ({
                    ...album,
                    photos: photosData.filter(photo => photo.album === album.id),
                }));

                setAlbums(updatedAlbums);
                setUncategorizedPhotos(uncategorized);
            } catch (error) {
                console.error('Error fetching albums and photos:', error);
            }
        };

        fetchAlbumsAndPhotos();
    }, []);

    const handleCreateAlbum = () => {
        if (albumName && !albums.some(album => album.AlbumName === albumName)) {
            Axios.post('https://hhbc-snw-api.netlify.app/api/addPhotoAlbum', { AlbumName: albumName })
                .then(() => {
                    setAlbums([...albums, { id: albums.length + 1, AlbumName: albumName, photos: [] }]);
                    setAlbumName('');
                    showToastMessage('Album created successfully!', 'success');
                })
                .catch((error) => {
                    console.error('Error creating album:', error);
                    showToastMessage('Error creating album.', 'danger');
                });
        }
    };

    const handleMovePhotoToAlbum = (photoId, newAlbumId) => {
        Axios.put(`https://hhbc-snw-api.netlify.app/api/updatePhotoAlbum`, { photoId, albumId: newAlbumId })
            .then(() => {
                setAlbums(prevAlbums =>
                    prevAlbums.map(album => {
                        const movedPhoto =
                            uncategorizedPhotos.find(p => p.id === photoId) ||
                            prevAlbums.flatMap(a => a.photos).find(p => p.id === photoId);

                        return {
                            ...album,
                            photos:
                                album.id === newAlbumId
                                    ? [...album.photos, movedPhoto]
                                    : album.photos.filter(p => p.id !== photoId)
                        };
                    })
                );

                setUncategorizedPhotos(prev => prev.filter(photo => photo.id !== photoId));
                showToastMessage('Photo successfully moved to new album!', 'success');
            })
            .catch((error) => {
                console.error('Error moving photo:', error);
                showToastMessage('Failed to move photo. Try again.', 'danger');
            });
    };

    const showToastMessage = (message, variant) => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
    };

    const openCarousel = (albumPhotos, startIndex) => {
        setCurrentAlbumPhotos(albumPhotos);
        setCurrentPhotoIndex(startIndex);
        setShowCarousel(true);
    };

    const handleCloseCarousel = () => {
        setShowCarousel(false);
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Photo Albums</h2>

            <Form className="mb-4 d-flex">
                <Form.Control
                    type="text"
                    placeholder="Enter album name"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                />
                <Button variant="primary" onClick={handleCreateAlbum} className="ms-2">
                    Create Album
                </Button>
            </Form>

            {/* Uncategorized Photos */}
            {uncategorizedPhotos.length > 0 && (
                <div className="mb-5">
                    <h3 className="text-center">Uncategorized Photos</h3>
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {uncategorizedPhotos.map((photo, index) => (
                            <Col key={photo.id}>
                                <Card className="shadow-sm border-0">
                                    <Card.Img
                                        onClick={() => openCarousel(uncategorizedPhotos, index)}
                                        variant="top"
                                        src={`data:image/jpeg;base64,${photo.image_data}`}
                                        alt={photo.filename}
                                        className="photo-card-img"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <Card.Body>
                                        <Card.Text className="text-center">{photo.filename}</Card.Text>
                                        <DropdownButton
                                            variant="secondary"
                                            title="Move to Album"
                                            className="w-100"
                                            onSelect={(albumId) => handleMovePhotoToAlbum(photo.id, parseInt(albumId))}
                                        >
                                            {albums.map(alb => (
                                                <Dropdown.Item key={alb.id} eventKey={alb.id}>
                                                    {alb.AlbumName}
                                                </Dropdown.Item>
                                            ))}
                                        </DropdownButton>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {/* Albums */}
            {albums.length === 0 ? (
                <p className="text-center">No albums found. Create one to get started.</p>
            ) : (
                albums.map((album) => (
                    <div key={album.id} className="mb-5">
                        <h3 className="text-center">{album.AlbumName}</h3>
                        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                            {album.photos.length > 0 ? (
                                album.photos.map((photo, index) => (
                                    <Col key={photo.id}>
                                        <Card className="shadow-sm border-0">
                                            <Card.Img
                                                onClick={() => openCarousel(album.photos, index)}
                                                variant="top"
                                                src={`data:image/jpeg;base64,${photo.image_data}`}
                                                alt={photo.filename}
                                                className="photo-card-img"
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <Card.Body>
                                                <Card.Text className="text-center">{photo.filename}</Card.Text>
                                                <DropdownButton
                                                    variant="secondary"
                                                    title="Move to Album"
                                                    className="w-100"
                                                    onSelect={(albumId) => handleMovePhotoToAlbum(photo.id, parseInt(albumId))}
                                                >
                                                    {albums
                                                        .filter(a => a.id !== album.id)
                                                        .map(a => (
                                                            <Dropdown.Item key={a.id} eventKey={a.id}>
                                                                {a.AlbumName}
                                                            </Dropdown.Item>
                                                        ))}
                                                </DropdownButton>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <p className="text-center">No photos in this album.</p>
                            )}
                        </Row>
                    </div>
                ))
            )}

            {/* Carousel Modal */}
            <Modal show={showCarousel} onHide={handleCloseCarousel} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Photo Carousel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel
                        activeIndex={currentPhotoIndex}
                        onSelect={(selectedIndex) => setCurrentPhotoIndex(selectedIndex)}
                    >
                        {currentAlbumPhotos.map((photo, index) => (
                            <Carousel.Item key={photo.id}>
                                <img
                                    className="d-block w-100"
                                    src={`data:image/jpeg;base64,${photo.image_data}`}
                                    alt={photo.filename}
                                    style={{ height: '500px', objectFit: 'cover' }}
                                />
                                <Carousel.Caption>
                                    <h5>{photo.filename}</h5>
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Modal.Body>
            </Modal>

            {/* Toast Notification */}
            <ToastContainer position="bottom-end" className="p-3">
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                    bg={toastVariant}
                >
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default PhotoAlbum;
