import type { Config, Context } from '@netlify/functions'

// Mirrors the `/e/*` route that index.js served locally: try each upstream in
// order and return the first asset that resolves.
const BASE_URLS = [
  'https://raw.githubusercontent.com/v-5x/x/fixy',
  'https://raw.githubusercontent.com/ypxa/y/main',
  'https://raw.githubusercontent.com/ypxa/w/master',
]

export default async (req: Request, context: Context) => {
  const assetPath = new URL(req.url).pathname.replace(/^\/e\//, '')

  if (!assetPath) {
    return new Response('Not found', { status: 404 })
  }

  for (const baseUrl of BASE_URLS) {
    try {
      const asset = await fetch(`${baseUrl}/${assetPath}`)

      if (asset.ok) {
        return new Response(asset.body, {
          headers: {
            'Content-Type': asset.headers.get('content-type') ?? 'application/octet-stream',
            'Cache-Control': 'public, max-age=86400',
          },
        })
      }
    } catch (error) {
      console.error('Error fetching:', error)
    }
  }

  return new Response('Not found', { status: 404 })
}

export const config: Config = {
  path: '/e/*',
}
