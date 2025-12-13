const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth.routes.js');
const donorRoutes =require('./routes/donor.routes.js');
const requestRoutes =require('./routes/request.routes.js')


const cookieParser = require('cookie-parser');

const cors = require('cors');
const { auth } = require('firebase-admin');

const FRONTEND_DEV_URL = 'http://localhost:5173';

const corsOptions = {
    origin: [FRONTEND_DEV_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.get('/aise',(req,res)=>{
    res.send('THIS is wokring ifine')
})

app.use('/api/auth', authRoutes);
app.use('/api/donor',donorRoutes);
app.use('/api/request',requestRoutes)



app.listen(4000, () => {
   
    console.log('Server running on 4000');
});
