const fileUpload = require('express-fileupload');
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const app = express();
const initRoutes = require("./routes/fileRoutes");

global.__basedir = __dirname;

var path = "./uploads/";
!fs.existsSync(path) && fs.mkdirSync(path);

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(express.static(__dirname + '/public'));
app.use(fileUpload());
app.set('view engine', 'ejs');

app.use(cors(corsOptions));
app.use('/', initRoutes);

let port = 8080;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});