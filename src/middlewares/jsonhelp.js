import fs from 'fs';
import path from 'path';

export function jsonHelper(req, res, next) {
    req.jsonReadFile = function (filename) {
        try {
            let data = fs.readFileSync(path.join(process.cwd(), "src", "database", filename + ".json"));
            data = data ? JSON.parse(data) : [];
            return data; 
        } catch (err) {
            return next(err);
        }
    }

    req.jsonWriteFile = function (filename, data) {
        try {
            fs.writeFileSync(path.join(process.cwd(), "src", "database", filename + ".json"), JSON.stringify(data, null, 4));
        } catch (err) {
            return next(err);
        }
    }

    next();
}