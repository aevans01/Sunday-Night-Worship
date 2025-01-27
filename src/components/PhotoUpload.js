import React, { useState } from "react";
import axios from "axios";
import { Card, Button, Form, Spinner, Alert } from "react-bootstrap";

const PhotoUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("photo", selectedFile);

        setUploading(true);
        setUploadSuccess(null);

        try {
            const response = await axios.post("https://deploy-preview-3--hhbc-snw-api.netlify.app/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                setUploadSuccess(true);
            } else {
                setUploadSuccess(false);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setUploadSuccess(false);
        } finally {
            setUploading(false);
            setSelectedFile(null);
        }
    };

    return (
        <Card className="p-4 mx-auto mt-5" style={{ maxWidth: "500px" }}>
            <Card.Body>
                <Card.Title className="mb-4">Upload a Photo</Card.Title>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Select a photo to upload:</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                </Form.Group>
                <Button
                    variant="primary"
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile}
                    className="w-100"
                >
                    {uploading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Upload"}
                </Button>
                {uploadSuccess === true && (
                    <Alert variant="success" className="mt-3">Upload successful!</Alert>
                )}
                {uploadSuccess === false && (
                    <Alert variant="danger" className="mt-3">Upload failed. Please try again.</Alert>
                )}
            </Card.Body>
        </Card>
    );
};

export default PhotoUpload;
