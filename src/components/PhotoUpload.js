import React, { useState } from "react";
import axios from "axios";
import { Card, Button, Form, Spinner, Alert } from "react-bootstrap";

const PhotoUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFiles(Array.from(event.target.files));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            alert("Please select at least one file to upload.");
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("photos", file);
        });

        setUploading(true);
        setUploadSuccess(null);

        try {
            const response = await axios.post("https://hhbc-snw-api.netlify.app/api/upload", formData, {
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
            setSelectedFiles([]);
        }
    };

    return (
        <Card className="p-4 mx-auto mt-5" style={{ maxWidth: "500px" }}>
            <Card.Body>
                <Card.Title className="mb-4">Upload Photos</Card.Title>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Select photos to upload:</Form.Label>
                    <Form.Control type="file" accept="image/*" multiple onChange={handleFileChange} />
                </Form.Group>
                <Button
                    variant="primary"
                    onClick={handleUpload}
                    disabled={uploading || selectedFiles.length === 0}
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
