export default {
  async fetch(request) {
    const url = new URL(request.url);

    // If it's a static file (has extension), serve normally
    if (url.pathname.match(/\.\w+$/)) {
      return fetch(request);
    }

    // For all other routes, serve index.html (SPA routing)
    const assetUrl = new URL('/index.html', url.origin);
    return fetch(new Request(assetUrl.toString(), request));
  }
};
