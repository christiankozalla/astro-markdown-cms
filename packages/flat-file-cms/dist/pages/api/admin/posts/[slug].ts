import { APIRoute } from "astro";
import {
  authenticationHandler,
  dbClient,
  helpers,
} from "../../../../blog-backend";

export const post: APIRoute = async ({ params, request }) => {
  const cookies = request.headers.get("cookie");
  const { isValid, email } = await authenticationHandler(
    helpers.parseCookies(cookies),
    import.meta.env.SESSION_NAME,
  );
  if (!isValid || !params.slug) {
    return new Response(null, { status: 401 });
  }
  const body = await request.json();

  const isDraft = new URL(request.url).searchParams.has("draft");
  try {
    const written = await dbClient.writePost(
      params.slug.toString(),
      body,
      isDraft,
    );
    // Node's writeFile returns a Promise that resolves to undefined upon success!
    if (written === undefined) {
      return new Response(null, { status: 201 });
    } else {
      throw new Error(`Failed to write file: ${params.slug}.md`);
    }
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
};
