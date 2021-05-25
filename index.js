#!/usr/bin/env node
import meow from 'meow';
import cheevo from './src/cheevo.js';

const cli = meow(
  `
	Usage
	  $ cheevo <query>

	Options
	  --detail, -d  Include detailed cheevo statistics
	  --extra, -e  Include extra cheevo statistics

	Examples
	  $ cheevo --detail --extra
`,
  {
    importMeta: import.meta,
    flags: {
      detail: {
        type: 'boolean',
        alias: 'd',
      },
    },
  }
);

cheevo(cli.input[0], cli.flags);
