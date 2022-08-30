import { readFile } from 'node:fs/promises';
import { join } from 'path';
import { getSession } from './helpers.mjs';

export async function authenticationHandler(req, res, next) {
  // check if user has a cookie
  const cookie = req.cookies[process.env.SESSION_NAME];

  if (cookie) {
    const sessionIsValid = await validateSession(cookie);

    if (sessionIsValid) {
      return next(); // to '/admin'
    } else {
      return res.redirect('/admin/login');
    }
  } else {
    // User has no cookie, should register?
    return res.redirect('/admin/register');
  }
}

async function validateSession(cookie) {
  const [email, token, expires] = cookie.split(':::');
  const now = Date.now();
  if (now > expires) return false;

  const sessions = await readFile(
    join(process.cwd(), 'data', 'cms', 'sessions.txt'),
    { encoding: 'utf8' }
  );

  const session = getSession(email, sessions);

  if (!session) return false;

  return session.split(':::')[1] === token;
}
