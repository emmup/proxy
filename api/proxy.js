export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter.' });
    }

    try {
        // Validasi URL
        const parsedUrl = new URL(url);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return res.status(400).json({ error: 'Invalid URL protocol.' });
        }

        // Fetch gambar atau resource dari target
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({ error: `Failed to fetch: ${response.statusText}` });
        }

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'application/octet-stream';

        // Set header agar bisa diakses bebas (CORS)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Content-Type', contentType);

        res.status(200).send(Buffer.from(buffer));
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy server error.' });
    }
}
