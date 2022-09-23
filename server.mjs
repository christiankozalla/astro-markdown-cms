import express from 'express';
import nunjucks from 'nunjucks';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { handler as ssrHandler } from './astro/server/entry.mjs';
import { cmsRouter, viewsBasePath } from './cms/router.mjs';

const PORT = process.env.PORT || 3000;

const app = express();

nunjucks.configure(viewsBasePath, {
  autoescape: true,
  express: app
});
app.set('view engine', 'njk');

app.use(cookieParser());
app.use(express.json());

app.use(express.static('astro/client'));
app.use(ssrHandler);
app.use('/admin', cmsRouter);

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
