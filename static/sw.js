importScripts('/dy/config.js?v=4')
importScripts('/dy/worker.js?v=4')
importScripts('/m/bundle.js?v=4')
importScripts('/m/config.js?v=4')
importScripts(__uv$config.sw || '/m/sw.js?v=4')

const uv = new UVServiceWorker()
const dynamic = new Dynamic()

let userKey = new URL(location).searchParams.get('userkey')
self.dynamic = dynamic

// The proxy workers build their reply from the `x-bare-status` header. When the
// bare endpoint is not a bare server, that header is absent and the status
// coerces to 0, which throws an unhelpful RangeError. Turn it into something
// readable instead.
const isMissingBareServer = (error) =>
  /status provided \(0\)|outside the range|x-bare-status/i.test(String(error && error.message))

function proxyError(error) {
  const detail = isMissingBareServer(error)
    ? 'The bare server did not answer. Check that the "bare" endpoint in /m/config.js and /dy/config.js points at a running bare server, that it is reachable over HTTPS, and that it allows this origin via CORS.'
    : String(error && error.message ? error.message : error)

  return new Response(
    `<!doctype html><meta charset="utf-8"><title>Proxy error</title>` +
      `<style>body{font:16px/1.5 system-ui,sans-serif;margin:3rem auto;max-width:34rem;padding:0 1rem}code{word-break:break-all}</style>` +
      `<h1>Proxy error</h1><p>${detail.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c])}</p>`,
    {
      status: 502,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }
  )
}

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async function () {
      try {
        if (await dynamic.route(event)) {
          return await dynamic.fetch(event)
        }

        if (event.request.url.startsWith(location.origin + '/a/')) {
          return await uv.fetch(event)
        }

        return await fetch(event.request)
      } catch (error) {
        return proxyError(error)
      }
    })()
  )
})
