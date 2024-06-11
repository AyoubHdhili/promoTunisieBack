const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/'); // Directory to save the uploaded files
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Append the current timestamp to the original filename
    }
  });
  
  const upload = multer({ storage: storage });

  module.exports = upload;