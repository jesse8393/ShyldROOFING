// @ts-check
import { defineConfig } from 'astro/config';

// Static site. Hostinger serves the built files from public_html and the
// bundled .htaccess maps clean URLs (/roof-repair) to the generated
// roof-repair.html file, so we build one flat HTML file per route.
export default defineConfig({
  site: 'https://shyldroofing.com',
  output: 'static',
  trailingSlash: 'never',
  compressHTML: true,
  build: {
    format: 'file',
    inlineStylesheets: 'always',
    assets: 'assets',
  },
  image: {
    responsiveStyles: true,
  },
  devToolbar: { enabled: false },
});
