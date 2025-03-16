import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal, Carousel, Dropdown, DropdownButton } from 'react-bootstrap';
import Axios from 'axios';
import '../style/PhotoAlbum.css';  // Import your CSS file

const PhotoAlbum = () => {
    const [albums, setAlbums] = useState([]);
    const [albumName, setAlbumName] = useState('');
    const [uncategorizedPhotos, setUncategorizedPhotos] = useState([]); // Store unassigned photos
    const [showCarousel, setShowCarousel] = useState(false); // State to show carousel
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // State for current photo in the carousel
    const [currentAlbumPhotos, setCurrentAlbumPhotos] = useState([]); // Photos of the selected album

    useEffect(() => {
        const fetchAlbumsAndPhotos = async () => {
            try {
                // Fetch albums
                const albumResponse = await Axios.get('https://hhbc-snw-api.netlify.app/api/getPhotoAlbum');
                const albumsData = albumResponse.data;
                console.log("Fetched Albums:", albumsData);

                // Fetch photos
                const photoResponse = await Axios.get('https://hhbc-snw-api.netlify.app/api/getPhotos');
                const photosData = photoResponse.data;
                console.log("Fetched Photos:", photosData);

                // Separate photos with no assigned album
                const uncategorized = photosData.filter(photo => photo.album === null || photo.album === undefined || photo.album === "");
                console.log(photosData);
                photosData.map(photo => console.log(photo.album));
                console.log("uncategorized: " + uncategorized);

                // Merge photos into albums
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
                    console.log('Album created successfully');
                    setAlbums([...albums, { id: albums.length + 1, AlbumName: albumName, photos: [] }]);
                    setAlbumName('');
                })
                .catch((error) => console.error('Error creating album:', error));
        }
    };

    const handleMovePhotoToAlbum = (photoId, newAlbumId) => {
        console.log("Moving photo with ID:", photoId, "to album with ID:", newAlbumId);
        Axios.put(`https://hhbc-snw-api.netlify.app/api/updatePhotoAlbum`, { photoId: photoId, albumId: newAlbumId })
            .then(() => {
                // Update the frontend state to reflect the move
                setAlbums(prevAlbums => {
                    return prevAlbums.map(album => {
                        if (album.id === newAlbumId) {
                            // Add the photo to the new album
                            const movedPhoto = uncategorizedPhotos.find(photo => photo.id === photoId);
                            return { ...album, photos: [...album.photos, movedPhoto] };
                        } else {
                            // Remove the photo from its previous album
                            return {
                                ...album,
                                photos: album.photos.filter(photo => photo.id !== photoId),
                            };
                        }
                    });
                });
                setUncategorizedPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
                console.log("Photo moved to new album!");
            })
            .catch((error) => console.error('Error moving photo:', error));
    };

    const openCarousel = (albumPhotos, startIndex) => {
        setCurrentAlbumPhotos(albumPhotos); // Set the photos of the selected album
        setCurrentPhotoIndex(startIndex); // Set the starting index of the carousel
        setShowCarousel(true); // Show the carousel modal
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
                            <Col key={index}>
                                <Card className="shadow-sm border-0" >
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

                                        {/* Dropdown to move photo to a different album */}
                                        {/*<DropdownButton
                                            variant="secondary"
                                            title="Move to Album"
                                            className="w-100"
                                            onSelect={(albumId) => handleMovePhotoToAlbum(photo.id, parseInt(albumId))} // Fix: Pass photo.id correctly
                                        >
                                            {albums.map(album => (
                                                <Dropdown.Item key={album.id} eventKey={album.id}>
                                                    {album.AlbumName}
                                                </Dropdown.Item>
                                            ))}
                                        </DropdownButton>*/}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {/* Albums with Photos */}
            {albums.length === 0 ? (
                <p className="text-center">No albums found. Create one to get started.</p>
            ) : (
                albums.map((album) => (
                    <div key={album.id} className="mb-5">
                        <h3 className="text-center">{album.AlbumName}</h3>
                        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                            {album.photos.length > 0 ? (
                                album.photos.map((photo, index) => (
                                    <Col key={index}>
                                        <Card className="shadow-sm border-0" >
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

                                                {/* Dropdown to move photo to a different album */}
                                                {/*<DropdownButton
                                                    variant="secondary"
                                                    title="Move to Album"
                                                    className="w-100"
                                                    onSelect={(albumId) => handleMovePhotoToAlbum(photo.id, parseInt(albumId))} // Fix: Pass photo.id correctly
                                                >
                                                    {albums.map(album => (
                                                        <Dropdown.Item key={album.id} eventKey={album.id}>
                                                            {album.AlbumName}
                                                        </Dropdown.Item>
                                                    ))}
                                                </DropdownButton>*/}
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
                    <Carousel activeIndex={currentPhotoIndex} onSelect={(selectedIndex) => setCurrentPhotoIndex(selectedIndex)}>
                        {currentAlbumPhotos.map((photo, index) => (
                            <Carousel.Item key={index}>
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
        </Container>
    );
};

export default PhotoAlbum;
