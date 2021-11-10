const fs = require("fs");
const path = require('path');
const baseUrl = "http://localhost:8080/";
const pathName = "./uploads/";

module.exports.getListFiles = (req, res) => {
  let fileInfos = [];

  fs.readdir(pathName, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    for (let file of files) {
      let extension = path.extname(file).toLowerCase();

      fileInfos.push({
        name: file,
        url: baseUrl + file,
        isImage: file && (extension.includes('gif') || extension.includes('jpeg') || extension.includes('png'))
      });
    }

    res.render('index', {
      fileInfos: fileInfos,
    });
  });
};

module.exports.download = (req, res) => {
  const fileName = req.params.name;

  res.download(pathName + fileName, fileName, (err) => {
    if (err) {
      console.error("Could not download the file. " + err);
    }
  });
};

module.exports.upload = (req, res) => {
  if (req.files) {
    const file = req.files.file;
    const fileName = file.name;

    fs.writeFile(pathName + fileName, file.data, (err) => {
      console.error(err);
    });

    res.redirect('/');
  } else {
    console.log('There are no files');
  }
};