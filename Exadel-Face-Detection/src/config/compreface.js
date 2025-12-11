import axios from "axios";

export const compreface = axios.create({
    baseURL: process.env.COMPRE_FACE_BASE_URL,
    headers: {
        "x-api-key": process.env.COMPRE_FACE_API_KEY
    }
});
