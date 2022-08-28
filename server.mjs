import express from 'express';
import { handler as ssrHandler } from './dist/server/entry.mjs';

const app = express();
app.use(express.static('dist/client/'));
app.use('/admin', express.static('./build/'));
app.use(ssrHandler);

app.listen(8080);
