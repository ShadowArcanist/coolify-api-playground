#!/usr/bin/env bun
// scripts/update-openapi.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

function parseYAML(content) {
  const lines = content.split('\n');
  const result = {
    info: null,
    servers: [],
    paths: null,
    components: null,
    currentSection: null
  };

  let inInfo = false;
  let inServers = false;
  let inPaths = false;
  let serversStart = -1;
  let serversEnd = -1;
  let pathsStart = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === 'info:') {
      inInfo = true;
      inServers = false;
      continue;
    }

    if (inInfo && line.startsWith('  version:')) {
      result.info = { version: line.trim().replace(/^  version:['"]?([^'"]+)['"]?$/, '$1') };
      inInfo = false;
      continue;
    }

    if (trimmed === 'servers:') {
      inServers = true;
      serversStart = i;
      continue;
    }

    if (inServers && trimmed.startsWith('- ') || trimmed.startsWith('  - ') || (trimmed.length > 0 && !trimmed.startsWith(' ') && !trimmed.startsWith('-'))) {
      if (trimmed === 'paths:' || (!trimmed.startsWith(' ') && !trimmed.startsWith('-'))) {
        inServers = false;
        serversEnd = i - 1;
      }
    }

    if (trimmed === 'paths:') {
      inPaths = true;
      pathsStart = i;
      break;
    }
  }

  // Extract servers section
  if (serversStart >= 0) {
    if (serversEnd < 0) {
      for (let i = serversStart; i < lines.length; i++) {
        if (lines[i].trim() === 'paths:') {
          serversEnd = i - 1;
          break;
        }
      }
    }
    if (serversEnd < 0) serversEnd = lines.length - 1;
    result.servers = lines.slice(serversStart, serversEnd + 1);
  }

  // Extract paths and rest
  if (pathsStart >= 0) {
    result.paths = lines.slice(pathsStart);
  }

  return result;
}

async function main() {
  const sampleFile = 'sample-openapi.yaml';
  const outputFile = 'openapi.yaml';

  if (!existsSync(sampleFile)) {
    console.error('sample-openapi.yaml not found. Run download first.');
    process.exit(1);
  }

  console.log('Reading sample-openapi.yaml...');
  const sampleContent = readFileSync(sampleFile, 'utf-8');
  const sample = parseYAML(sampleContent);

  if (!sample.servers || sample.servers.length === 0) {
    console.error('Could not extract servers section from sample-openapi.yaml');
    process.exit(1);
  }

  console.log(`Extracted version: ${sample.info?.version || 'unknown'}`);
  console.log(`Servers section has ${sample.servers.length} lines`);

  // Build new openapi.yaml
  const newContent = [
    'openapi: 3.1.0',
    'info:',
    `  title: Coolify`,
    `  version: '${sample.info?.version || '0.1'}'`,
    ...sample.servers,
    ...sample.paths
  ].join('\n');

  writeFileSync(outputFile, newContent);
  console.log(`✅ Updated ${outputFile} with new version and servers`);
  console.log(`   Version: ${sample.info?.version}`);
}

main().catch(console.error);
