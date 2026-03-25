export async function onRequest(context) {
  const response = await context.next();
  if (response.status !== 404) {
    return response;
  }

  const url = new URL(context.request.url);
  let path = url.pathname;

  if (path.endsWith("/") && path.length > 1) {
    path = path.slice(0, -1);
  }

  const parentPath = path.substring(0, path.lastIndexOf("/"));
  if (parentPath) {
    const dynamicUrl = new URL(parentPath + "/_/index.html", url.origin);
    const dynamicResponse = await context.env.ASSETS.fetch(dynamicUrl);
    if (dynamicResponse.ok) {
      return new Response(dynamicResponse.body, {
        status: 200,
        headers: dynamicResponse.headers,
      });
    }
  }

  const rootUrl = new URL("/index.html", url.origin);
  return context.env.ASSETS.fetch(rootUrl);
}
