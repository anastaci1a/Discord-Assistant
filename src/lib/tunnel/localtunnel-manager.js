// dependencies

import localtunnel from 'localtunnel';
const subdomain = process.env.SUBDOMAIN || "insert-subdomain-here";


// exports

export async function startLocaltunnel(port) {
  const tunnel = await localtunnel({ port, subdomain: subdomain });
  console.log(`localhost:${port} tunneled to`, tunnel.url);
  tunnel.on('close', () => console.log('Tunnel closed'));
};
