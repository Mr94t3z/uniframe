
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

app.route('/poap', poap)
app.route('/gallery', gallery)
app.route('/genart', genart)

export default app
