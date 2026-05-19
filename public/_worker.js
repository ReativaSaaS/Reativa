export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Try to serve static asset first
    const assetResponse = await env.ASSETS.fetch(request);

    // If asset exists or it's a file with extension, serve it
    if (assetResponse.status !== 404 || pathname.match(/\.\w+$/)) {
      return assetResponse;
    }

    // For SPA routes, serve index.html
    const indexRequest = new Request(new URL('/index.html', url.origin).toString(), request);
    return env.ASSETS.fetch(indexRequest);
  }
};
