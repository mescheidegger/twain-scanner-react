// services.js
const fs = require('fs');
const path = require('path');

exports.saveFile = (file, callback) => {
    const newPath = path.join(__dirname, 'server_uploads', file.originalname);
    fs.rename(file.path, newPath, callback);
};

exports.listFiles = (callback) => {
    const directoryPath = path.join(__dirname, 'server_uploads');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.log('Failed to list files:', err);
            return callback(err);
        }

        // Filter out the .gitignore file
        const filteredFiles = files.filter(file => file !== '.gitignore');
        
        callback(null, filteredFiles);
    });
};


exports.sendFile = (filename, res) => {
    const filePath = path.join(__dirname, 'server_uploads', filename);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log('File does not exist:', err);
            return res.status(404).send('File not found');
        }
        res.sendFile(filePath);
    });
};