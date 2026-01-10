
import { writeFile, unlink } from 'node:fs/promises';

const url = 'https://github.com/coollabsio/coolify/raw/v4.x/openapi.yaml';
const destination = './sample-openapi.yaml';

async function download() {
  console.log(`Downloading openapi.yaml from ${url}...`);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download openapi.yaml: ${response.statusText}`);
  }
  const content = await response.text();
  
  // Delete existing file first to ensure we get the latest
  try {
    await unlink(destination);
  } catch (e) {
    // File doesn't exist, ignore
  }
  
  await writeFile(destination, content);
  console.log('sample-openapi.yaml downloaded successfully.');
}

download().catch(console.error);
