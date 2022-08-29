export function checkExistingUser(email, list) {
  const emailExits = list.split('\n').some((entry) => entry.startsWith(email));

  return emailExits;
}

export function getSession(email, list) {
  return list.split('\n').find((entry) => entry.startsWith(email));
}
