const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const routes = require('./routes');
const upload = require('./multerConfig');


app.use(express.json());
app.set('trust proxy', 1);
app.use(upload.single('file'));
app.use('/api', routes);

// Production configurations
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the 'build' folder in production
    app.use(express.static(path.join(__dirname, 'client/build'), {
      // Caching policy can go here
    }));
    // Service index.html as a catch-all route
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});