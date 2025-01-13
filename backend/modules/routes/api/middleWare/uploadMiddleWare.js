const path = require('path');
const multer = require('multer');
const mkdirp = require('mkdirp');

const today = new Date();
const day = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();

const imageUploadPath = `./public/uploads/images/${year}/${month + 1}/${day}/`;
const pdfUploadPath = `./public/uploads/pdf/${year}/${month + 1}/${day}/`;

let type = ''
const ImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      type = 'img'
      mkdirp(imageUploadPath, (err) => cb(err, imageUploadPath));
    } else if (file.mimetype === 'application/pdf') {
      type = 'pdf'
      mkdirp(pdfUploadPath, (err) => cb(err, pdfUploadPath));
    } else {
      cb(new Error('Invalid file type'));
    }
  },
  filename: (req, file, cb) => {
    var date = Date.now();
    var newName = date + '-' + file.originalname.replace(/ /g, '-');
    cb(null, newName);
    file.originalname = newName;

    if (req.file === undefined) req.file = [];
    if(type === 'img')
    req.file.push(imageUploadPath + file.originalname);
    else if(type === 'pdf')
    req.file.push(pdfUploadPath + file.originalname);

  },
});

const uploadArrayFile = multer({
  storage: ImageStorage,
});

module.exports = {
  uploadArrayFile,
};