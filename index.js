#!/usr/bin/env node

const { checkFile, logCheevo } = require('./src/helpers.js');

const cheevoFile = 'cheevos';
const xboxCheevoFile = 'xboxCheevos';
const trophyFile = 'trophies';

main();

function main() {
  let cheevoData = readFiles(cheevoFile, xboxCheevoFile, trophyFile);
  let cheevos = cheevoData.total.cheevos;

  const input = typeof process !== 'undefined' && process.argv[2];
  cheevos = filterCheevos(cheevos, input);

  if (!cheevos.length) {
    console.log(
      `404: ${input ? `Query "${input}"` : 'Cheevo json'} not found.`
    );
    return;
  }

  console.log(getCheevoInfo(cheevos, cheevoData));
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

function getCheevoInfo(cheevos, cheevoData) {
  let cheevoInfo = '\n';
  cheevos.forEach((x) => (cheevoInfo += logCheevo(x) + '\n'));
  cheevoInfo += `Total cheevos: ${cheevoData.total.cheevos.length} in ${cheevoData.total.gameCount} games`;

  if (cheevoData[cheevoFile].cheevos.length)
    cheevoInfo += `\nSteam: ${cheevoData[cheevoFile].cheevos.length} cheevos in ${cheevoData[cheevoFile].gameCount} games`;

  if (cheevoData[xboxCheevoFile].cheevos.length)
    cheevoInfo += `\nXbox: ${cheevoData[xboxCheevoFile].cheevos.length} cheevos in ${cheevoData[xboxCheevoFile].gameCount} games`;

  if (cheevoData[trophyFile].cheevos.length)
    cheevoInfo += `\nPSN: ${cheevoData[trophyFile].cheevos.length} trophies in ${cheevoData[trophyFile].gameCount} games`;

  return cheevoInfo + `\n`;
}

function filterCheevos(cheevos, input) {
  if (input) {
    return cheevos.filter(
      (x) =>
        x.title.toUpperCase().includes(input.toUpperCase()) ||
        x.text.toUpperCase().includes(input.toUpperCase())
    );
  }
  const cheevo = cheevos[Math.floor(Math.random() * cheevos.length)];
  return cheevos.filter((x) => x.title === cheevo.title);
}
