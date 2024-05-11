const express = require('express');
const controller = require('./controllers');
const limiter = require('./rateLimit');
const router = express.Router();

router.post('/upload-file', limiter, controller.uploadFile); 
router.get('/get-files', limiter, controller.getUploadedFiles);
router.get('/view-file/:filename', limiter, controller.viewFile);


module.exports = router;