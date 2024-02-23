// dependencies

import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// exports

export function getPathFromSRC(filePath) {
  let rootPath = path.resolve(__dirname, '../');
  let targetPath = path.join(rootPath, filePath);
  return targetPath;
}

export async function loadJsonFromFile(filePath) { // relative to directory src
  filePath = getPathFromSRC(filePath);
  try {
    const data = await fsp.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return undefined;
  }
}

export async function saveJsonToFile(filePath, json = {}) { // relative to directory src
  filePath = getPathFromSRC(filePath);
  const data = JSON.stringify(json, null, 2);
  await fsp.writeFile(filePath, data);
}

export async function getModulesInDirectory(dirPath) {
  // Assuming getPathFromSRC is another function that computes the path based on the src directory
  let realDir = getPathFromSRC(dirPath); // Ensure `getPathFromSRC` handles paths correctly in ES Modules context
  let packages = [];

  const files = await fsp.readdir(realDir); // Using async fs promises for non-blocking operation

  for (const file of files) {
    if (file.endsWith('.js')) {
      let filePath = getPathFromSRC(path.join(dirPath, file)); // Ensure path is correctly formatted
      // Convert file system path to URL path for dynamic import
      const fileURL = new URL(`file://${filePath}`);
      try {
        const pkg = await import(fileURL.href); // Dynamic import returns a promise
        packages.push(pkg);
      } catch (error) {
        console.error(`Error importing ${fileURL.href}:`, error);
      }
    }
  }

  return packages;
}
