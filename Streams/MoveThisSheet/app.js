const tar = require("tar");
const fs = require("fs");

var path = '../MoveThisSheet/output';
!fs.existsSync(path) && fs.mkdirSync(path);

var writeStream = fs.createWriteStream(`${path}/output/data.zip`);

tar.c({ gzip: true },["./input/"]).pipe(writeStream);