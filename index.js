#!/usr/bin/env node
import meow from 'meow';
import cheevo from './src/cheevo.js';

const cli = meow(
  `
	Usage
	  $ cheevo <query>

	Options
    <query>        Filter on cheevo title or description
	  --all,     -a  Show all cheevos meeting the specified criteria
	  --detail,  -d  Include detailed cheevo statistics
	  --extra,   -e  Include extra cheevo statistics
	  --game,    -g  Filter on game name
	  --help,    -h  Show this help
	  --number,  -n  Filter specific cheevo number, query is ignored
	  --psn,     -p  Filter exlusive on psn
	  --rarity,  -r  Filter on rarity
	  --steam,   -s  Filter exlusive on steam
	  --type,    -t  Filter specific type
	  --xbox,    -x  Filter exlusive on xbox

	Examples
	  $ cheevo --detail --extra

    $ cheevo --rarity 10 --type plat --all
`,
  {
    importMeta: import.meta,
    flags: {
      all: {
        type: 'boolean',
        alias: 'a',
      },
      detail: {
        type: 'boolean',
        alias: 'd',
      },
      extra: {
        type: 'boolean',
        alias: 'e',
      },
      game: {
        type: 'string',
        alias: 'g',
      },
      help: {
        type: 'boolean',
        alias: 'h',
      },
      number: {
        type: 'number',
        alias: 'n',
      },
      psn: {
        type: 'boolean',
        alias: 'p',
      },
      rarity: {
        type: 'number',
        alias: 'r',
      },
      steam: {
        type: 'boolean',
        alias: 's',
      },
      type: {
        type: 'string',
        alias: 't',
      },
      xbox: {
        type: 'boolean',
        alias: 'x',
      },
    },
  }
);

cheevo(cli.input[0], cli.flags);
