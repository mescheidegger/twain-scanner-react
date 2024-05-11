// API.js
export const uploadFile = async (formData) => {
    try {
        const response = await fetch('/api/upload-file', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json(); 
    } catch (error) {
        console.error('Error during file upload:', error);
        throw error;
    }
};

export const getUploadedFiles = async () => {
    try {
        const response = await fetch('/api/get-files', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json(); // Assuming server sends back a JSON response
    } catch (error) {
        console.error('Error during fetching files:', error);
        throw error;
    }
};

// Function to get URL for viewing a file
export const getFileUrl = (filename) => `${process.env.REACT_APP_SERVER_URL}/api/view-file/${encodeURIComponent(filename)}`;
