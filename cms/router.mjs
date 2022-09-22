import express from 'express';
import { join } from 'path';
import { readFile, appendFile } from 'node:fs/promises';
import { encrypt, decrypt } from './lib/hash.mjs';
import {
  hasSuperUser,
  checkExistingUser,
  getUser,
  csv,
  createExpiryDate,
  createSession,
  hasSemi
} from './lib/helpers.mjs';
import { login, logout, readSessions } from './lib/db-operations.mjs';
import { authenticationHandler } from './lib/auth.mjs';
import initDb from './lib/init-db.mjs';
initDb(); // creates files

const cmsRouter = express.Router();

// all paths are relative to '/admin'
cmsRouter.get('/', authenticationHandler, (req, res, next) => {
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
  if (hasSuperUser(users)) {
    console.log('Only a single user - the superuser - is allowed.');
    return res.status(409);
  }
  else if (checkExistingUser(req.body.email, users)) {
    console.log('User already exists!', req.body.email);
    return res.status(409);
  } else {
    const encryptedPassword = encrypt(req.body.password);
    // should login(email) do create session instead and return the session?
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

    const appendSession = login(session);

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

      const sessions = await readSessions();
      // deletes all sessions of this user
      await logout(req.body.email, sessions);
      await login(session);

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
    console.log('Bad password - unauthorized');
    return res.status(401);
  }
});

export { cmsRouter };
