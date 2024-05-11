import React, { useState, useEffect } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import FileTable from './FileTable';
import FileViewer from './FileViewer';
import { uploadFile, getUploadedFiles, getFileUrl } from './API';
import DWT from './dwt';

const Home = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [viewFile, setViewFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const uploadedFiles = await getUploadedFiles();
            setFiles(uploadedFiles);
        } catch (error) {
            console.error('Failed to fetch files:', error);
            alert('Failed to fetch files. Check console for details.');
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first!');
            return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await uploadFile(formData);
            fetchFiles();  // Refresh file list after upload
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed! Check console for error.');
        }

        setSelectedFile(null);
        document.getElementById('fileInput').value = '';
    };

    const handleViewFile = (filename) => {
        const url = getFileUrl(filename);
        setViewFile(url);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setViewFile(null);
    };

    return (
        <Container>
            <h1>Welcome to TWAIN Acquire and Upload File Demo</h1>
            <FileTable files={files} onViewFile={handleViewFile} />
            <FileViewer show={showModal} url={viewFile} onClose={handleCloseModal} />
            
            <div className="mt-4">
                <Form>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Control 
                            id="fileInput"
                            type="file"
                            onChange={handleFileChange}
                            style={{ width: '500px', marginRight: '10px' }}
                        />
                        <Button variant="primary" onClick={handleFileUpload} disabled={!selectedFile}>
                            Upload
                        </Button>
                        <DWT onFileUpload={fetchFiles} />
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default Home;
