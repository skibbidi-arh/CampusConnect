const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require("./config/db");
dotenv.config();

const authRoutes = require('./routes/auth.routes.js');
const donorRoutes = require('./routes/donor.routes.js');
const requestRoutes = require('./routes/request.routes.js')
const lostItemsRoutes = require('./routes/LostItem.routes.js')
const roomBookingRoutes = require('./routes/roomBooking.routes.js')
const feedBackRoutes = require('./routes/feedbackRoutes.js')
const httpproxy = require('http-proxy')


const cookieParser = require('cookie-parser');

const cors = require('cors');
const { auth } = require('firebase-admin');

const FRONTEND_DEV_URL = 'http://localhost:5173';
const GATEWAY_URL = 'http://localhost:4000';


const corsOptions = {
    origin: [FRONTEND_DEV_URL, GATEWAY_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/request', requestRoutes)
app.use('/api/lost-items', lostItemsRoutes)
app.use('/api/bookRoom', roomBookingRoutes)
app.use('/anonymous/api/feedback', feedBackRoutes)






app.listen(4000, () => {
    connectDB();
    console.log('Server running on 4000');
});
