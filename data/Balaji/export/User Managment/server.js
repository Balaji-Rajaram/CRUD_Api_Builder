const express = require("express");
const path = require("path"); 
const mongoose = require("mongoose");
const config = require("./config/config.json");

const PORT = 3000
const app = express();   
const MONGO_URI = config.MONGODB_URI;

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true,useUnifiedTopology: true  })
    .then(console.log('MongoDB connected' + MONGO_URI))
    .catch(err => console.log(err));
const user = require('./router/user')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user',user)    

app.listen(PORT,()=>{console.log('app listening on port' + PORT)})