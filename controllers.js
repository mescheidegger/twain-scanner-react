// controllers.js
const fileService = require('./services');

exports.uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    fileService.saveFile(req.file, (err) => {
        if (err) {
            return res.status(500).send('Server error occurred.');
        }
        res.send({ message: 'File uploaded successfully!', path: req.file.path });
    });
};

exports.getUploadedFiles = (req, res) => {
    fileService.listFiles((err, files) => {
        if (err) {
            return res.status(500).send('Server error occurred when listing files.');
        }
        res.send(files);
    });
};

exports.viewFile = (req, res) => {
    const { filename } = req.params;
    fileService.sendFile(filename, res);
};