const ngrok = require('ngrok');

async function startNgrok(port) {
  const url = await ngrok.connect({
    proto: 'http',
    addr: `127.0.0.1${port}`,
    authtoken: process.env.NGROK_AUTH_TOKEN,
    hostname: "teal-useful-mackerel.ngrok-free.app"
  });
  console.log(`Server running on ${url}:${port}...`)
};

module.exports = { startNgrok };
