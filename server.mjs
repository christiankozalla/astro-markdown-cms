import express from 'express';
import { handler as ssrHandler } from './astro/server/entry.mjs';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static('astro/client'));
app.use(ssrHandler);
app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
