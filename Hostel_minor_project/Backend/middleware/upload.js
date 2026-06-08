const multer = require("multer");
const mongoose = require("mongoose");
const fetchuser = require('../middleware/fetchuser');
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;

const dbPromise = new Promise((resolve) => {
    if (mongoose.connection.readyState === 1) {
        resolve(mongoose.connection.db);
    } else {
        mongoose.connection.once("open", () => resolve(mongoose.connection.db));
    }
});

const storage = new GridFsStorage({
    db: dbPromise,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    
    file: (req, file) => {
       
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}profile_${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}profile_${file.originalname}`,
        };
    },
});

module.exports = multer({ storage });