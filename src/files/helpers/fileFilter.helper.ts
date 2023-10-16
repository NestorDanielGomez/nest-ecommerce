import { Request } from "express";

export const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
    if (!file) return cb(new Error("Archivo vacio"), false);
    const fileExtension = file.mimetype.split("/")[1];
    const validExtension = ["jpg", "jpeg", "png", "gif"]

    if (validExtension.includes(fileExtension)) {
        //acepto el archivo
        return cb(null, true)
    }

    cb(null, false)
}