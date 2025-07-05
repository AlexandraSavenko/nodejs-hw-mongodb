import multer from "multer";

import createHttpError from "http-errors";
import { TEMP_UPLOAD_DIR } from "../constants/index.js";

const storage = multer.diskStorage({
    destination: TEMP_UPLOAD_DIR,
    filename: (req, file, callback) => {
    const uniquePrefix = `${Date.now()}_${Math.random() * 1E9}`;
    const fileNewName = `${uniquePrefix}_${file.originalname}`;
    callback(null, fileNewName);
}
});

const limits = {
    fileSize: 1024 * 1024 * 5
};

const fileFilter = (req, file, callback) => {
    const extention = file.originalname.split(".").pop();
    if(extention === "exe"){
        return callback(createHttpError(400, ".exe extention is not allowed"));
    }
    callback(null, true);
};

export const upload = multer({
storage,
limits,
fileFilter
});