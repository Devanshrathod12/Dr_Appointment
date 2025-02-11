import multer from "multer";

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname); // Save file with its original name
    }
});

const upload = multer({ storage });
export default upload;
