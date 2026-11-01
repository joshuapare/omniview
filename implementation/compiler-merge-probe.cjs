const fs = require('node:fs');
const path = require('node:path');
const babel = require('/Users/joshuapare/Repos/omniviewdev/workspaces/workspaces/filesystem-explorer-design/node_modules/.pnpm/@babel+core@7.29.7_supports-color@8.1.1/node_modules/@babel/core');
const compiler = '/Users/joshuapare/Repos/omniviewdev/workspaces/workspaces/filesystem-explorer-design/node_modules/.pnpm/babel-plugin-react-compiler@1.0.0/node_modules/babel-plugin-react-compiler';
const results = [];
for (const relative of ['packages/base-ui/src/components/tree-list/hooks/useTreeStore.ts', 'packages/base-ui/src/components/tree-list/TreeList.tsx']) {
  const filename = path.join(process.cwd(), relative);
  const events = [];
  babel.transformSync(fs.readFileSync(filename, 'utf8'), {
    filename, babelrc: false, configFile: false,
    parserOpts: { plugins: ['typescript', 'jsx'] },
    plugins: [[compiler, { logger: { logEvent: (_, event) => events.push(event) } }]],
  });
  results.push({ file: relative, events });
}
console.log(JSON.stringify(results, null, 2));
