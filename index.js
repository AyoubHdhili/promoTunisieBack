const express = require("express")
const http = require("http")
const mongoose = require("mongoose")
const config = require('./database/dbConfig.json');
var path = require("path");
const cors = require('cors');
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));

// Configure CORS options
const corsOptions = {
    origin: 'http://localhost:4200', // Replace with your Angular app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to send cookies with CORS requests
    optionsSuccessStatus: 204
  };

  app.use(cors(corsOptions));

const server = http.createServer(app);

const userRouter = require('./routes/userRoute');

app.use('/users', userRouter);

mongoose.connect(config.mongo.uri);

server.listen(3000,()=>{console.log("server is running on port 3000")});