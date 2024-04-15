// dependencies

import ngrok from 'ngrok';


// exports

export async function startNgrok(port) {
  const url = await ngrok.connect({
    proto: 'http',
    addr: `127.0.0.1:${port}`,
    authtoken: process.env.NGROK_AUTH_TOKEN,
    hostname: process.env.NGROK_HOSTNAME
  });
  console.log(`localhost:${port} tunneled to ${url}...`);
};
