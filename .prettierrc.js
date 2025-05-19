// .prettierrc.js
module.exports = {
  semi: false,            // remove semicolons
  singleQuote: true,      // use single quotes
  trailingComma: 'all',   // multi-line trailing commas
  printWidth: 100,        // max line length before wrapping
  tabWidth: 2,            // two-space indents
  bracketSpacing: true,   // { foo: bar }
  arrowParens: 'always',  // always include parens: (x) => x
  endOfLine: 'lf',        // normalize to LF (use 'auto' if mixed environments)
  proseWrap: 'preserve',  // respect markdown text wrapping
  embeddedLanguageFormatting: 'auto', // format code blocks in MD/HTML/etc.

  overrides: [
    {
      // JSON files must use double quotes and no trailing commas
      files: ['*.json', '*.jsonc'],
      options: {
        parser: 'json',
        singleQuote: false,
        trailingComma: 'none',
      },
    },
    {
      // YAML should use its own parser rules
      files: ['*.yml', '*.yaml'],
      options: {
        parser: 'yaml',
        singleQuote: false,
        trailingComma: 'none',
      },
    },
    {
      // Markdown: wrap at 80 chars, keep proseWrap consistent
      files: ['*.md', '*.markdown'],
      options: {
        parser: 'markdown',
        printWidth: 80,
      },
    },
    {
      // HTML, XML, and Vue templates
      files: ['*.html', '*.xhtml', '*.vue'],
      options: {
        parser: 'html',
      },
    },
    {
      // CSS, SCSS, Less
      files: ['*.css', '*.scss', '*.less'],
      options: {
        parser: 'css',
      },
    },
    {
      // GraphQL files
      files: ['*.graphql', '*.gql'],
      options: {
        parser: 'graphql',
      },
    },
    {
      // Handle TSX/JSX with JSX syntax
      files: ['*.tsx', '*.jsx'],
      options: {
        parser: 'babel-ts',
      },
    },
  ],
}
