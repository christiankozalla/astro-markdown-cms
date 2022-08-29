import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { handler as ssrHandler } from './dist/server/entry.mjs';
import { cmsRouter } from './cms/router.mjs';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(express.static('dist/client/'));
app.use(ssrHandler);
app.use('/admin', cmsRouter);

app.listen(8080);
