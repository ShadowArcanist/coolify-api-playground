import { createMDXSource } from 'fumadocs-mdx';
import { loader } from 'fumadocs-core/source';
import { transformerOpenAPI } from 'fumadocs-openapi/server';
import { docs, meta } from '@/.source';

export const source = loader({
  baseUrl: '/',
  source: createMDXSource(docs, meta),
  pageTree: {
    transformers: [transformerOpenAPI()],
  },
});