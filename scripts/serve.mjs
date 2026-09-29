// Local preview server that mimics the Hostinger .htaccess behaviour:
// clean URLs map to flat .html files, .html requests redirect, gzip/brotli on text.
import http from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import zlib from 'node:zlib';

const root = process.env.DIST || 'dist';
const port = Number(process.env.PORT || 4321);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};
const compressible = new Set(['.html', '.css', '.js', '.mjs', '.json', '.xml', '.txt', '.svg', '.webmanifest']);

function resolve(pathname) {
  let p = decodeURIComponent(pathname);
  if (p.endsWith('/') && p !== '/') return { redirect: p.replace(/\/+$/, '') };
  if (p.endsWith('.html')) {
    const clean = p.replace(/\.html$/, '');
    return { redirect: clean === '/index' ? '/' : clean };
  }
  if (p === '/index') return { redirect: '/' };
  if (p === '/') p = '/index.html';
  const safe = normalize(p).replace(/^(\.\.[/\\])+/, '');
  const direct = join(root, safe);
  if (existsSync(direct) && statSync(direct).isFile()) return { file: direct };
  const html = `${direct}.html`;
  if (existsSync(html)) return { file: html };
  return { file: join(root, '404.html'), status: 404 };
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    const r = resolve(url.pathname);
    if (r.redirect) {
      res.writeHead(301, { Location: r.redirect + url.search });
      return res.end();
    }
    const ext = extname(r.file);
    const type = types[ext] || 'application/octet-stream';
    const headers = { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff' };
    headers['Cache-Control'] = ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable';
    const accept = req.headers['accept-encoding'] || '';
    let stream = createReadStream(r.file);
    if (compressible.has(ext)) {
      if (accept.includes('br')) {
        headers['Content-Encoding'] = 'br';
        stream = stream.pipe(zlib.createBrotliCompress());
      } else if (accept.includes('gzip')) {
        headers['Content-Encoding'] = 'gzip';
        stream = stream.pipe(zlib.createGzip());
      }
    } else {
      headers['Content-Length'] = statSync(r.file).size;
    }
    res.writeHead(r.status || 200, headers);
    stream.pipe(res);
  })
  .listen(port, () => console.log(`preview on http://localhost:${port} serving ${root}`));
