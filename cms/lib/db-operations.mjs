import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import { purgeList } from './helpers.mjs';
const sessionsPath = join(process.cwd(), 'data', 'cms', 'sessions.txt');

export function getSession() {
  return readFile(sessionsPath, { encoding: 'utf8' });
}

export function login(session) {
  return appendFile(sessionsPath, session, { encoding: 'utf8' });
}

// Delete all sessions with base64-encoded email
export function logout(emailBase64, sessions) {
  return writeFile(sessionsPath, purgeList(emailBase64, sessions).join('\n'), {
    encoding: 'utf8'
  });
}
