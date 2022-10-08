import { APIRoute } from "astro";
import { parseCookies } from "../../../../lib/admin/helpers";
import { authenticationHandler } from "../../../../lib/admin/auth";
import { writePost } from "../../../../lib/db-client";

export const post: APIRoute = async ({ params, request }) => {
  const cookies = request.headers.get("cookie");
  const { isValid, email } = await authenticationHandler(parseCookies(cookies));
  if (!isValid) {
    return new Response(null, { status: 401 });
  }
  const body = await request.json();

  const isDraft = new URL(request.url).searchParams.has("draft");
  try {
    const written = await writePost(params.slug.toString(), body, isDraft);
    // Node's writeFile returns a Promise that resolves to undefined upon success!
    if (written === undefined) {
      return new Response(null, { status: 201 });
    }
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
};
