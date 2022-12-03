# Astro Starter Kit: Blog

## DB docs

The following JSON structure was initially planned, but is not implemented yet!
The Database rather consists of txt-files, that hold the records line-by-line.

The Database consists of JSON files.

### Users

`users.json` holds all user login data like the following exammple Structure

```json
{
  "base-64-encoded-email": {
    "pw": { "iv": "some-hash", "content": "some-other-hash" },
    "name": "Username"
  }
}
```

To ensure "findability" of records, we need to follow some conventions:

1. The user's email will always be processed base-64 encoded. Not for security
   reasons, of course, but for string matching to find a record by email.
2. So the client needs to send the email already base-64 encoded to the server,
   for convenience.

### Sessions

Sessions will be stored in `sessions.json`

```json
{
  "base-64-encoded-email": {
    "token": "full-session-cookie",
    "validUntil": "ISOTimestamp"
  }
}
```

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page
is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put
any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our
[Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely
[Bear Blog](https://github.com/HermanMartinus/bearblog/).
