export function checkExistingUser(email, list) {
    const emailExits = list.split("\n").some((entry) => entry.startsWith(email));
    return emailExits;
}
export function getSession(email, list) {
    return list.split("\n").find((entry) => entry.startsWith(email));
}
export function getUser(email, list) {
    return list.split("\n").find((entry) => entry.startsWith(email));
}
export function purgeList(email, list) {
    if (Array.isArray(list)) {
        return list.filter((entry) => !entry.startsWith(email)).filter(Boolean);
    }
    else {
        return [];
    }
}
export function base64(string) {
    return Buffer.from(string).toString("base64url");
}
export function csv(...strings) {
    return strings.join(";") + "\n";
}
function randomString() {
    return (Math.random() + 1).toString(36).substring(2);
}
export function hasSemi(...strings) {
    return strings.includes(";");
}
export function createSession(emailBase64, expiryDateMs) {
    return `${emailBase64}:::${randomString()}:::${expiryDateMs || createExpiryDate()}`;
}
export function createExpiryDate() {
    const date = new Date();
    return date.setDate(date.getDate() + 7);
}
export function hasSuperUser(users) {
    return users.split("\n").filter(Boolean).length > 1;
}
export function parseCookies(cookies) {
    if (!cookies)
        return [];
    const arrayLike = cookies.split(";").map((cookie) => cookie.split("="));
    return arrayLike.map(([key, value]) => ({ [key]: value }));
}
export function emptyPost() {
    return {
        markdown: "",
        frontMatter: {
            title: "",
            description: "",
            heroImage: "",
            pubDate: "",
            layout: "../../layouts/BlogPost.astro",
        },
    };
}
export function slugify(title) {
    return title.replaceAll(" ", "-").toLowerCase();
}
