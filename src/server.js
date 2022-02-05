import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import path from 'path';
import { configs } from "#config"
const PORT = process.env.PORT || configs.PORT
const app = express();

app.use( express.json() );
app.use( fileUpload() );
app.use( express.json() );
app.use( cors({
    "origin": "https://pressa-n2.netlify.app"
}) );

import { jsonHelper } from "#mid/jsonhelp";
import verify from '#mid/verify';

app.use(jsonHelper);

app.use('/getting', express.static(path.join(process.cwd(), 'media')));

import authorizationRouter from '#routes/authorization';
import postRouter from '#routes/posts';
import categoryRouter from '#routes/category';
import adminRouter from '#routes/admin';

app.use('/authorization', authorizationRouter);
app.use('/posts', postRouter);
app.use('/categories', categoryRouter);
app.use('/admin',verify , adminRouter);

app.use((err, req, res, next) => {
    console.log(err);
    ([400, 401, 402, 403, 404]).includes(err.status) ? res.status(err.status).send(err) : res.status(500).send({status:500, message: "Internal Server Error"}); 
})

app.listen(PORT, () => console.log("running http://localhost:" + PORT));