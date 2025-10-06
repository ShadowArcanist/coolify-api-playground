// scripts/generate-api-docs.mjs
import { generateFiles } from 'fumadocs-openapi'

void generateFiles({
  input: ['./openapi.yaml', './openapi.json'],
  output: './content',
  includeDescription: true,
  addGeneratedComment: false,
  per: 'operation',
  groupBy: 'tag',
  imports: [
    // only import the UI component
    { names: ['APIPage'], from: 'fumadocs-openapi/ui' },
  ],
})
  .then(() => console.log('✅ Generated API MDX into content'))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })