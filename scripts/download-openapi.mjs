
import { writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';

const url = 'https://github.com/coollabsio/coolify/raw/v4.x/openapi.yaml';
const destination = './openapi.yaml';

async function download() {
  try {
    await access(destination, constants.F_OK);
    console.log('openapi.yaml already exists, skipping download.');
  } catch (e) {
    console.log('Downloading openapi.yaml...');
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download openapi.yaml: ${response.statusText}`);
    }
    const content = await response.text();
    await writeFile(destination, content);
    console.log('openapi.yaml downloaded successfully.');
  }
}

download();
