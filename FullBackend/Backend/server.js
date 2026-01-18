const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth.routes.js');
const donorRoutes = require('./routes/donor.routes.js');
const requestRoutes = require('./routes/request.routes.js')
const lostItemsRoutes = require('./routes/LostItem.routes.js')
const roomBookingRoutes = require('./routes/roomBooking.routes.js')
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


app.use('/auth', authRoutes);
app.use('/donor', donorRoutes);
app.use('/request', requestRoutes)
app.use('/lost-items', lostItemsRoutes)
app.use('/bookRoom',roomBookingRoutes)



app.listen(4001, () => {

    console.log('Server running on 4001');
});
