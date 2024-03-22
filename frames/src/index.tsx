
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

app.use(async (c, next) => { // [!code focus]
  await next(); // [!code focus]
  const isFrame = c.res.headers.get('content-type')?.includes('html');

  if (isFrame) { // [!code focus]
    let html = await c.res.text(); // [!code focus]
    const metaTag = '<meta property="of:accepts:xmtp" content="2024-02-01" />'; // [!code focus]
    html = html.replace(/(<head>)/i, `$1${metaTag}`); // [!code focus]
    c.res = new Response(html, { // [!code focus]
      headers: { // [!code focus]
        'content-type': 'text/html', // [!code focus]
      }, // [!code focus]
    }); // [!code focus]
  } // [!code focus]
}); 

app.route('/poap', poap)
app.route('/gallery', gallery)
app.route('/genart', genart)

export default app
