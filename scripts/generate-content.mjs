import { mkdir, readFile, writeFile } from 'node:fs/promises'

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))
const lab = await readJson('src/content/lab.json')
const publications = await readJson('src/content/publications.json')
const projects = await readJson('src/content/projects.json')

await mkdir('public/data', { recursive: true })
await Promise.all([
  writeFile('public/data/lab.json', JSON.stringify(lab, null, 2) + '\n'),
  writeFile('public/data/publications.json', JSON.stringify(publications, null, 2) + '\n'),
  writeFile('public/data/projects.json', JSON.stringify(projects, null, 2) + '\n'),
])

const publication = publications[0]
const lines = [
  `# ${lab.name}`,
  '',
  lab.description,
  '',
  `Scope: ${lab.scope}`,
  `Focus: ${lab.focus.join('; ')}`,
  '',
  '## Publications',
  '',
  `- ${publication.title}`,
  `  Authors: ${publication.authors.join('; ')}`,
  `  Venue: ${publication.venue}`,
  `  Paper: ${publication.pdf}`,
  `  DOI: ${publication.doi}`,
  `  Dataset: ${publication.dataset}`,
  '',
  '  BibTeX:',
  '  ' + publication.bibtex.split('\n').join('\n  '),
  '',
  '## Projects and datasets',
  '',
  ...projects.map((project) => `- ${project.name} (${project.type}): ${project.description} ${project.url}`),
  '',
  '## Machine-readable resources',
  '',
  '- /data/lab.json',
  '- /data/publications.json',
  '- /data/projects.json',
  '- /llms-full.txt',
  '',
  'GivenWhenLab provides structured resources to facilitate access by agents. This does not promise universal discovery or compatibility.',
  '',
  lab.disclaimer,
]
await writeFile('public/llms.txt', lines.slice(0, 20).join('\n') + '\n')
await writeFile('public/llms-full.txt', lines.join('\n') + '\n')
