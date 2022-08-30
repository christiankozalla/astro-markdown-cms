import express from 'express';
import { join } from 'path';
import { readFile, appendFile } from 'node:fs/promises';
import { encrypt, decrypt } from './lib/hash.mjs';
import { checkExistingUser, getUser } from './lib/helpers.mjs';
import { authenticationHandler } from './lib/auth.mjs';

const cmsRouter = express.Router();

// cmsRouter.use(authenticationHandler);

// all paths are relative to '/admin'
cmsRouter.get('/', authenticationHandler, (req, res, next) => {
  // return res.render();
  return res.send('<h1>Hello in a CMS</h1>');
});

cmsRouter.get('/register', (req, res, next) => {
  return res.sendFile(join(process.cwd(), 'cms', 'views', 'register.html'));
});

cmsRouter.post('/register', async (req, res, next) => {
  if (hasSemi(req.body.email, req.body.name)) {
    console.log('Email or Name include a Semicolon - Forbidden!');
    return;
  }

  const users = await readFile(
    join(process.cwd(), 'data', 'cms', 'users.txt'),
    { encoding: 'utf8' }
  );

  if (checkExistingUser(req.body.email, users)) {
    console.log('User already exists!', req.body.email);
    return res.status(409);
  } else {
    const encryptedPassword = encrypt(req.body.password);
    const expiryDate = createExpiryDate();
    const session = createSession(req.body.email, expiryDate);

    const appendUser = appendFile(
      join(process.cwd(), 'data', 'cms', 'users.txt'),
      csv(
        req.body.email,
        JSON.stringify(encryptedPassword),
        req.body.name || ''
      ),
      { encoding: 'utf8' }
    );

    const appendSession = appendFile(
      join(process.cwd(), 'data', 'cms', 'sessions.txt'),
      session,
      { encoding: 'utf8' }
    );

    await Promise.allSettled([appendUser, appendSession]);

    return res
      .status(201)
      .cookie(process.env.SESSION_NAME, session, {
        expires: new Date(expiryDate),
        path: '/admin',
        httpOnly: process.env.NODE_ENV === 'proction',
        secure: process.env.NODE_ENV === 'production'
      })
      .send();
  }
});

cmsRouter.get('/login', (req, res, next) => {
  return res.sendFile(join(process.cwd(), 'cms', 'views', 'login.html'));
});

cmsRouter.post('/login', async (req, res, next) => {
  const users = await readFile(
    join(process.cwd(), 'data', 'cms', 'users.txt'),
    { encoding: 'utf8' }
  );

  if (checkExistingUser(req.body.email, users)) {
    const [email, encryptedPassword, name] = getUser(
      req.body.email,
      users
    ).split(';');
    const isPasswordValid =
      req.body.password === decrypt(JSON.parse(encryptedPassword));

    if (isPasswordValid) {
      const expiryDate = createExpiryDate();
      const session = createSession(req.body.email, expiryDate);
      return res
        .status(200)
        .cookie(process.env.SESSION_NAME, session, {
          expires: new Date(expiryDate),
          path: '/admin',
          httpsOnly: process.env.NODE_ENV === 'production',
          secure: process.env.NODE_ENV === 'production'
        })
        .send();
    } else {
      return res.status(403);
    }
  } else {
    console.log('Bad passord - unauthorized');
    return res.status(401);
  }
});

function csv(...strings) {
  return strings.join(';') + '\n';
}

function randomString() {
  return (Math.random() + 1).toString(36).substring(2);
}

function hasSemi(...strings) {
  return strings.includes(';');
}

function createSession(email, expiryDate) {
  return `${Buffer.from(email).toString('base64url')}:::${randomString()}:::${
    expiryDate || createExpiryDate()
  }`;
}

function createExpiryDate() {
  const date = new Date();
  return date.setDate(date.getDate() + 7);
}

export { cmsRouter };
