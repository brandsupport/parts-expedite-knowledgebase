import apiHandler from "../../backend/worker.js";

// Pages Functions owns the production origin. Only /api/* is routed here;
// static files continue to be served directly from the Pages build output.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (!url.pathname.startsWith("/api/")) {
    return new Response("Not found", { status: 404 });
  }
  return apiHandler.fetch(context.request, context.env);
}
