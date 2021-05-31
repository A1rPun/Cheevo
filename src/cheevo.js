import {
  checkFile,
  logCheevos,
  logCheevoDetails,
  logCheevoExtra,
} from './helpers.js';

const files = ['cheevos', 'xboxCheevos', 'trophies'];

function main(input, options) {
  let cheevoData = readFiles(...files);
  let cheevos = cheevoData.total.cheevos;

  cheevos = filterCheevos(cheevos, input, options);

  if (!cheevos.length) {
    console.log(
      `404: ${input ? `Query "${input}"` : 'Cheevo json'} not found.`
    );
    return;
  }

  console.log(logCheevos(cheevos));

  if (cheevos.length > 5) {
    console.log(`Showing ${cheevos.length} results\n`);
  }

  if (options.detail) console.log(logCheevoDetails(files, cheevoData));
  if (options.extra) console.log(logCheevoExtra(files, cheevoData));
}

function readFiles(...files) {
  const cheevoData = files.reduce((acc, cur) => {
    checkFile(cur, (cheevos, gameCount) => {
      acc[cur] = { cheevos, gameCount };
    });
    return acc;
  }, {});
  cheevoData.total = Object.values(cheevoData).reduce(
    (acc, cur) => {
      acc.cheevos = [...acc.cheevos, ...cur.cheevos];
      acc.gameCount += cur.gameCount;
      return acc;
    },
    {
      cheevos: [],
      gameCount: 0,
    }
  );
  return cheevoData;
}

function filterCheevos(cheevos, input, options) {
  if (options.rarity) {
    cheevos = cheevos.filter((x) => x.rarity && x.rarity < options.rarity);
  }

  if (options.type) {
    cheevos = cheevos.filter(
      (x) => x.type && x.type.toUpperCase().includes(options.type.toUpperCase())
    );
  }

  if (options.game) {
    cheevos = cheevos.filter(
      (x) => x.game && x.game.toUpperCase().includes(options.game.toUpperCase())
    );
  }

  if (options.psn) {
    cheevos = cheevos.filter((x) => x.trophy_id);
  } else if (options.steam) {
    cheevos = cheevos.filter((x) => x.cheevo_id);
  } else if (options.xbox) {
    cheevos = cheevos.filter((x) => x.xbox_cheevo_id);
  }

  if (options.number) {
    return cheevos.filter((x) => x.count && x.count === options.number);
  } else if (input) {
    return cheevos.filter(
      (x) =>
        x.title.toUpperCase().includes(input.toUpperCase()) ||
        x.text.toUpperCase().includes(input.toUpperCase())
    );
  }

  if (!options.all) {
    const cheevo = cheevos[Math.floor(Math.random() * cheevos.length)];
    cheevos = cheevos.filter((x) => x.title === cheevo.title);
  }
  return cheevos;
}

export default main;
