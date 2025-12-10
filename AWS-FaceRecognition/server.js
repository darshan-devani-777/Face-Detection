const express = require('express');
const connectDB = require('./src/config/mongoConfig');
const faceRoutes = require('./src/routes/faceRoute');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();  

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/faces', faceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server start at http://localhost:${PORT}`);
});
