import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import path from 'path';
import { configs } from "#config"
const PORT = configs.PORT || process.env.PORT
const app = express();

app.use( express.json() );
app.use( fileUpload() );
app.use( express.json() );
app.use( cors() );

import { jsonHelper } from "#lib/jsonhelp"

app.use(jsonHelper);

app.use('/getting', express.static(path.join(process.cwd(), 'media')));

import postRouter from '#routes/posts'
import categoryRouter from '#routes/category'

app.use('/posts', postRouter);

app.use('/categories', categoryRouter);

app.use((err, req, res, next) => {
    console.log(err);
    res.json({
        message: err.message
    })
})

app.listen(PORT, () => console.log("running http://localhost:" + PORT));