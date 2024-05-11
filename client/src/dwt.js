import React from 'react';
import Dynamsoft from 'dwt';
import { Button, Form, Modal } from 'react-bootstrap';
import { uploadFile } from './API';

export default class DWT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            showModal: false,
            selectedFileType: '3',  // Default to PNG, '3' corresponds to PNG
            fileName: '',  // State to store user input for file name
        };
    }

    DWObject = null;
    containerId = 'dwtcontrolContainer';
    
    componentDidMount() {
        // Registers an event listener for the 'OnWebTwainReady' event.
        // This event triggers when the Dynamsoft Web TWAIN environment is fully loaded and ready to interact with.
        Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', () => {
            this.Dynamsoft_OnReady();
        });
    
        // Sets the product key for the Dynamsoft Web TWAIN library.
        Dynamsoft.DWT.ProductKey = process.env.REACT_APP_DWT_PRODUCT_KEY;
    
        // Specifies the path to the resources needed by Dynamsoft Web TWAIN.
        Dynamsoft.DWT.ResourcesPath = "/dwt-resources";
    
        // Configures the containers where Dynamsoft Web TWAIN will render the scanner's interface.
        // 'WebTwainId' is an identifier for the Web TWAIN instance, and 'ContainerId' is the DOM element where it will be embedded.
        // 'Width' and 'Height' set the size of the container.
        Dynamsoft.DWT.Containers = [{
            WebTwainId: 'dwtObject',
            ContainerId: this.containerId,
            Width: '300px',
            Height: '400px'
        }];
    
        // Initiates the loading of Dynamsoft Web TWAIN resources into the specified container.
        // This is necessary to prepare the environment for interacting with scanning hardware or performing other operations.
        Dynamsoft.DWT.Load();
    }
    

    Dynamsoft_OnReady = () => {
        this.DWObject = Dynamsoft.DWT.GetWebTwain(this.containerId);
    };

    handleChangeFileType = (event) => {
        this.setState({ selectedFileType: event.target.value });
    };

    handleFileNameChange = (event) => {
        this.setState({ fileName: event.target.value });
    };

    handleOpenModal = () => {
        this.setState({ showModal: true });
    };

    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    handleScan = async () => {
        this.handleCloseModal();
        this.setState({ loading: true });
        try {
            await this.DWObject.SelectSourceAsync();
            await this.DWObject.AcquireImageAsync({
                IfCloseSourceAfterAcquire: true,
            });

            const currentIndex = 0;
            const imageType = parseInt(this.state.selectedFileType);
            const fileExtension = this.fileTypes[imageType];
            const fileName = this.state.fileName || `scanned-image-${currentIndex}`;

            this.DWObject.ConvertToBlob([currentIndex], imageType, async (blob) => {
                const formData = new FormData();
                formData.append('file', blob, `${fileName}.${fileExtension}`);
                
                try {
                    await uploadFile(formData);
                    this.props.onFileUpload(); // Refresh file list in parent component
                    alert('Image uploaded successfully!');
                } catch (error) {
                    console.error('Error during file upload:', error);
                    alert(`Error: ${error.message}`);
                }
                
                this.setState({ loading: false, error: null });
                
            }, (errorCode, errorString) => {
                console.error(`ConvertToBlob failed: ${errorString}`);
                this.setState({ loading: false, error: errorString });
                alert(`ConvertToBlob failed: ${errorString}`);
            });
            
        } catch (error) {
            console.error('Error during image acquisition:', error);
            this.setState({ loading: false, error: error.message });
            alert(`Error: ${error.message}`);
        }
    };

    fileTypes = {
        0: 'bmp',
        1: 'jpg',
        2: 'tif',
        3: 'png',
        4: 'pdf'
    };

    render() {
        const { loading, error, showModal, selectedFileType, fileName } = this.state;
        return (
            <>
                <Button variant="primary" onClick={this.handleOpenModal} disabled={loading}>
                    {loading ? 'Processing...' : 'Scan'}
                </Button>
                <Modal show={showModal} onHide={this.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select File Type and Name</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>File Type</Form.Label>
                            <Form.Control as="select" value={selectedFileType} onChange={this.handleChangeFileType}>
                                {Object.entries(this.fileTypes).map(([value, label]) => (
                                    <option key={value} value={value}>{label.toUpperCase()}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>File Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter file name" value={fileName} onChange={this.handleFileNameChange} />                         
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleScan}>
                            Start Scan
                        </Button>
                    </Modal.Footer>
                </Modal>
                {error && <p>Error: {error}</p>}
                <div id={this.containerId}></div>
            </>
        );
    }
}
