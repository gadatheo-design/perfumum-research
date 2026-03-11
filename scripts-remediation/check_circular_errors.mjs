import ts from 'typescript';
import { createRequire } from 'module';

const files = ['server/db/molecules.ts', 'server/db/plants.ts', 'server/db/tabacs.ts'];
const program = ts.createProgram(files, {
  noEmit: true,
  strict: true,
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  baseUrl: '.',
  paths: { '@shared/*': ['shared/*'] },
  skipLibCheck: true,
  esModuleInterop: true
});

const diags = ts.getPreEmitDiagnostics(program);
const filtered = Array.from(diags).filter(d => {
  const f = d.file?.fileName || '';
  return files.some(t => f.endsWith(t.split('/').pop()));
});

console.log('Total errors in 3 files:', filtered.length);

const byFile = {};
filtered.forEach(d => {
  const name = d.file?.fileName.split('/').pop() || 'unknown';
  byFile[name] = (byFile[name] || 0) + 1;
});
Object.entries(byFile).forEach(([f, n]) => console.log(' ', f + ':', n));

filtered.slice(0, 10).forEach(d => {
  const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
  const line = d.file ? d.file.getLineAndCharacterOfPosition(d.start || 0).line + 1 : 0;
  console.log('  ' + d.file?.fileName.split('/').pop() + ':' + line + ' — ' + msg.substring(0, 120));
});
