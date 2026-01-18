const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5172'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api', createProxyMiddleware({
    target: 'http://localhost:4001',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
        console.log('\x1b[31m%s\x1b[0m', `>> [GATEWAY] ${req.method} -> MAIN SERVICE (4001)`);
    }
}));

app.use('/anonymous', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: {
        '^/anonymous': '',
    },
    onProxyReq: (proxyReq, req) => {
        console.log('\x1b[41m\x1b[37m%s\x1b[0m', ` >> [GATEWAY] ${req.method} -> ANONYMOUS APP (5000) `);
    }
}));

app.get('/status', (req, res) => {
    res.status(200).send('<h1 style="color:red; font-family:sans-serif;">GATEWAY: ONLINE</h1>');
});

app.listen(PORT, () => {
    console.log('\x1b[31m%s\x1b[0m', '--------------------------------------');
    console.log('\x1b[31m%s\x1b[0m', `  GATEWAY PORT: ${PORT}  `);
    console.log('\x1b[31m%s\x1b[0m', '--------------------------------------');
});