const express = require("express")
const http = require("http")
const mongoose = require("mongoose")
const config = require('./database/dbConfig.json');
var path = require("path");
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));

const server = http.createServer(app);


mongoose.connect(config.mongo.uri);

server.listen(3000,()=>{console.log("server is running on port 3000")});