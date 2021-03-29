const express = require("express");
const path = require("path");
const bodyparser=require("body-parser") 
const PORT = 3000
const app = express();


const frontend = require("./router/route")
const user = require("./api/user")
const workspace = require("./api/workspace")
const collection = require("./api/collection")
const download = require("./api/export")




app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 
app.set('view engine','ejs');
app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));


app.use("/",frontend)
app.use("/user",user)
app.use("/api/workspace",workspace)
app.use("/api/collection",collection)
app.use("/api/export",download)






app.listen(PORT,()=>{console.log(`app listening on port ${PORT}`)})