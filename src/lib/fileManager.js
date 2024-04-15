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

export async function getModulesInDirectory(dirPath) { // relative to directory src
  let realDir = getPathFromSRC(dirPath);
  let packages = [];

  const files = await fsp.readdir(realDir);

  for (const file of files) {
    if (file.endsWith('.js')) {
      let filePath = getPathFromSRC(path.join(dirPath, file));
      const fileURL = new URL(`file://${filePath}`);
      try {
        const pkg = await import(fileURL.href);
        packages.push(pkg);
      } catch (error) {
        console.error(`Error importing ${fileURL.href}:`, error);
      }
    }
  }

  return packages;
}
