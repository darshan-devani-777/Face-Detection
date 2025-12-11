import FormData from "form-data";
import fs from "fs";
import { compreface } from "../config/compreface.js";

export const recognizeFace = async (filePath) => {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const response = await compreface.post("/recognition/recognize", form, {
        headers: form.getHeaders(),
    });

    return response.data;
};
