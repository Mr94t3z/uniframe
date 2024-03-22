
import { Frog } from 'frog'
import { app as poap } from './routes/poap'
import { app as gallery } from './routes/gallery'
import { app as genart } from './routes/genart'

export const app = new Frog({
  // Supply a Hub API URL to enable frame verification.
  // hubApiUrl: 'https://api.hub.wevm.dev',
  // browserLocation: 'https://kodadot.xyz',
  // basePath: '/poap',
})

app.use(async (c, next) => {
  await next();
  const isFrame = c.res.headers.get('content-type')?.includes('html');

  if (isFrame) {
    let html = await c.res.text();
    const metaTag = '<meta property="of:accepts:xmtp" content="2024-02-01" />';
    html = html.replace(/(<head>)/i, `$1${metaTag}`);
    c.res = new Response(html, {
      headers: {
        'content-type': 'text/html',
      },
    });
  }
}); 

app.route('/poap', poap)
app.route('/gallery', gallery)
app.route('/genart', genart)

export default app
