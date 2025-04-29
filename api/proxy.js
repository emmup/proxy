export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Missing URL parameter.' }));
    }

    try {
        const parsedUrl = new URL(url);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Invalid URL protocol.' }));
        }

        const response = await fetch(url);

        if (!response.ok) {
            res.writeHead(response.status, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: `Failed to fetch: ${response.statusText}` }));
        }

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'application/octet-stream';

        // ⛔ Ganti semua header di satu tempat: writeHead (lebih aman di Vercel)
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400' // opsional: caching gambar
        });

        res.end(Buffer.from(buffer));
    } catch (error) {
        console.error('Proxy error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Proxy server error.' }));
    }
}
