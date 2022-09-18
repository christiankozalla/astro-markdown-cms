import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { handler as ssrHandler } from './astro/server/entry.mjs';
import { cmsRouter } from './cms/router.mjs';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(express.static('astro/client'));
app.use(ssrHandler);
app.use('/admin', cmsRouter);

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
