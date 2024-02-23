// dependencies

const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');


// export functions

function getPathFromSRC(filePath) {
  let rootPath = path.resolve(__dirname, '../');
  let targetPath = path.join(rootPath, filePath);
  return targetPath;
}

async function loadJsonFromFile(filePath) { // relative to directory src
  filePath = getPathFromSRC(filePath);
  try {
    const data = await fsp.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return undefined;
  }
}

async function saveJsonToFile(filePath, json = {}) { // relative to directory src
  filePath = getPathFromSRC(filePath);
  const data = JSON.stringify(json, null, 2);
  await fsp.writeFile(filePath, data);
}

function getModulesInDirectory(dirPath) { // relative to directory src
  let realDir = getPathFromSRC(dirPath);
  let packages = [];
  fs.readdirSync(realDir).forEach(file => {
    if (file.endsWith('.js')) {
      let filePath = getPathFromSRC(path.join(dirPath, file));
      const pkg = require(filePath);
      packages.push(pkg);
    }
  });
  return packages;
}


// exports

module.exports = { loadJsonFromFile, saveJsonToFile, getModulesInDirectory };
