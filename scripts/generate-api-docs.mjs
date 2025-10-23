// scripts/generate-api-docs.mjs
import { generateFiles } from 'fumadocs-openapi'

void generateFiles({
  input: ['./openapi.yaml'],
  output: './content',
  includeDescription: true,
  addGeneratedComment: false,
  per: 'operation',
  groupBy: 'tag',
})
  .then(() => console.log('✅ Generated API MDX into content'))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })