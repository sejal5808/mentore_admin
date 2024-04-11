const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderName = 'uploads/Course';
        const folderPath = path.join(__dirname, '..', folderName);
        console.log("123", folderName, folderPath)

        fs.mkdir(folderPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating directory:', err);
                cb(err, folderPath);
            } else {
                cb(null, folderPath);
            }
        });
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const storages = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderName = 'uploads/Trainer';
        const folderPath = path.join(__dirname, '..', folderName);
        console.log("1234", folderName, folderPath)
        fs.mkdir(folderPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating directory:', err);
                cb(err, folderPath);
            } else {
                cb(null, folderPath);
            }
        });
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})
const upload = multer({ storage: storage });
const uploads = multer({ storage: storages })
module.exports = { upload, uploads };