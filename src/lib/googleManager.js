// dependencies

import fs from 'fs/promises';
import http from 'http';
import url from 'url';
import { google } from 'googleapis';

import { StatusConsole } from './logging.js';
const console = new StatusConsole('googleManager.js');


// system

const port = process.env.PORT || 3000;
const oAuthEndpoint = '/oauth';

async function getOAuthClient(SCOPES, TOKEN_PATH, SECRET_PATH) {
  const credentials = JSON.parse(await fs.readFile(SECRET_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    const tokenStr = await fs.readFile(TOKEN_PATH);
    const token = JSON.parse(tokenStr);
    const now = new Date().getTime();

    if (!token.expiry_date || token.expiry_date <= now) {
      // if (token.refresh_token) {
      try {
        // Refresh the access token if possible
        await refreshAccessToken(oAuth2Client, token, TOKEN_PATH);
      } catch (error) {
        console.log(error);
        // No valid tokens available, initiate new auth flow
        await getAccessToken(oAuth2Client, SCOPES, TOKEN_PATH);
      }
    } else {
      // Token is valid, not expired
      oAuth2Client.setCredentials(token);
    }
  } catch (error) {
    // Token might not exist, prompting for new auth flow
    await getAccessToken(oAuth2Client, SCOPES, TOKEN_PATH);
  }

  return oAuth2Client;
}

async function refreshAccessToken(oAuth2Client, token, TOKEN_PATH) {
  oAuth2Client.setCredentials({ refresh_token: token.refresh_token });
  const { credentials } = await oAuth2Client.refreshAccessToken();
  const newTokens = { ...token, ...credentials };
  await fs.writeFile(TOKEN_PATH, JSON.stringify(newTokens));
  oAuth2Client.setCredentials(newTokens);
}

async function getAccessToken(oAuth2Client, SCOPES, TOKEN_PATH) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  console.log('Authorize this app by visiting this url:', authUrl);

  const authCode = await new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      if (req.url.indexOf(oAuthEndpoint) > -1) {
        const qs = new url.URL(req.url, `http://localhost:${port}`).searchParams;
        const code = qs.get('code');
        res.end('Authentication successful! Please return to the console.');
        server.close();
        resolve(code);
      }
    }).listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
    });
  });

  const { tokens } = await oAuth2Client.getToken(authCode);
  oAuth2Client.setCredentials(tokens);
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
}


// exports

export { getOAuthClient };
