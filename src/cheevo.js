import { checkFile, logCheevo } from './helpers.js';

const cheevoFile = 'cheevos';
const xboxCheevoFile = 'xboxCheevos';
const trophyFile = 'trophies';

function main(input, options) {
  let cheevoData = readFiles(cheevoFile, xboxCheevoFile, trophyFile);
  let cheevos = cheevoData.total.cheevos;

  cheevos = filterCheevos(cheevos, input);

  if (!cheevos.length) {
    console.log(
      `404: ${input ? `Query "${input}"` : 'Cheevo json'} not found.`
    );
    return;
  }

  console.log(getCheevoInfo(cheevos));
  if (options.detail) console.log(getCheevoInfoDetail(cheevoData));
  if (options.extra) console.log('extra');
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

function getCheevoInfo(cheevos) {
  let cheevoInfo = cheevos.reduce(
    (acc, cur) => acc + logCheevo(cur) + '\n\n',
    '\n'
  );
  return cheevoInfo.slice(0, -1);
}

function getCheevoInfoDetail(cheevoData) {
  let cheevoInfo = `Total cheevos: ${cheevoData.total.cheevos.length} in ${cheevoData.total.gameCount} games`;

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

export default main;
