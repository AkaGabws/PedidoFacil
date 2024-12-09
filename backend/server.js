const express = require ('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express,jason());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ${SPORT}'));

const orderRoutes = require('./routes/orderRoutes');
app.use('/api', orderRoutes)