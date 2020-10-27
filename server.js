const express = require("express");
const frontend = require("./router/route")
const path = require("path"); 
const PORT = 3000
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/",frontend)



app.listen(PORT,()=>{console.log(`app listening on port ${PORT}`)})