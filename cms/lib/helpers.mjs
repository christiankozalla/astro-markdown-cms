export function checkExistingUser(email, list) {
  const emailExits = list.split('\n').some((entry) => entry.startsWith(email));

  return emailExits;
}

export function getSession(email, list) {
  return list.split('\n').find((entry) => entry.startsWith(email));
}

export function getUser(email, list) {
  return list.split('\n').find((entry) => entry.startsWith(email));
}

export function purgeList(email, list) {
  if (Array.isArray(list)) {
    return list.filter((entry) => !entry.startsWith(email));
  } else {
    return [];
  }
}

export function base64(string) {
  return Buffer.from(string).toString('base64url');
}

export function csv(...strings) {
  return strings.join(';') + '\n';
}

function randomString() {
  return (Math.random() + 1).toString(36).substring(2);
}

export function hasSemi(...strings) {
  return strings.includes(';');
}

export function createSession(emailBase64, expiryDateMs) {
  return `${emailBase64}:::${randomString()}:::${
    expiryDateMs || createExpiryDate()
  }`;
}

export function createExpiryDate() {
  const date = new Date();
  return date.setDate(date.getDate() + 7);
}
