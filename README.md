# Astro Markdown CMS

> :warning: This package is in pre-alpha! Do not use in serious projects. Everything is subject to change! Still, if you try it, your feedback is very much appreciated!

Astro Markdown CMS provides several Astro pages and API endpoints for managing markdown blog posts. You need to run your Astro project in SSR mode in order to use Astro Markdown CMS. Additionally, the production environment must allow access to the file system, because posts, user and session data are written directly to the file system.

I have had good experience with using the [@astrojs/node adapter](https://www.npmjs.com/package/@astrojs/node) and deploying to [Fly.io](https://fly.io).

Currently, Astro Markdown CMS only allows you to:

- Create a user, log in
- Write blog posts in markdown, save as draft, publish

Many features are yet to be implemented

- :o: Email verification, password recovery
- :o: User roles and user invitation (i.e. a super-admin can create invitation links for co-authors)
- :o: Images in blog posts - either as upload to the server or to S3


## Usage

In order to use the Astro Markdown CMS integration in your Astro project, you need to:

- enable SSR by adding an adapter, e.g. `npx astro add node` [More on Astro adapters here](https://astro.build/integrations/adapters/)
- Provide environment variables in `.env`.
  - `MARKDOWN_CMS_SECRET` - a 32bit string used as an encryption key for user passwords
  - `MARKDOWN_CMS_SESSION_NAME` (optional) - a name for the session cookie

Install the integration with

```
npm install astro-markdown-cms
```

or

```
yarn add astro-markdown-cms
```

Add the integration to your `astro.config.mjs`

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import markdownCMS from "astro-markdown-cms";

// https://astro.build/config
export default defineConfig({
  /* ... */
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [markdownCMS()],
});
```

## Routes

The CMS provides several Astro pages and API endpoints:

- `/admin` - The Dashboard to manage blog posts
- `/admin/login` - Login form for the user
- `/admin/register` - Register form - only a single user can register at the moment, because otherwise literally *anyone* could register and mess with your blog posts.
- `/admin/posts/new` - Gives you an empty editor in order to create a blog post from scratch.
- `/admin/[slug]` - Blog post editor to write and manange a post
- `/api/admin/login`, `/api/admin/register` - Endpoints that receive credentials, issue session cookies.
- `/api/admin/posts/[slug]` - Endpoint to process instructions from the blog post editor.

## Example: Use in dynamic page `[slug].astro`

```javascript
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { dbClient } from "flat-file-cms/utils";
const slug = Astro.params.slug.toString();
const { post, error } = await dbClient.getPost(slug);
if (error) {
  console.log(error);
  return Astro.redirect("/");
}
const permalink = `${Astro.site.href}${slug}`;
---

<BaseLayout title={post.frontMatter.title} description={post.frontMatter.description} permalink={permalink}>
  <section>
    <p>{post.frontMatter.pubDate}</p>
    <h1>{post.frontMatter.title}</h1>
    <hr />
  </section>
  <div class="container">
    <article class="content" set:html={post.html} />
    <hr />
  </div>
</BaseLayout>
```
