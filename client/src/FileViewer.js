import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const FileViewer = ({ show, url, onClose }) => {
    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>File Viewer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <iframe title="ImageViewer" src={url} style={{ width: '100%', height: '500px' }}></iframe>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FileViewer;
