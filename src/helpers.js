const chalk = require('chalk');
const fs = require('fs');

// const trophy = require('./trophy.js');

const platinumColor = '#0000ff';
const goldColor = '#d4af37';
const silverColor = '#c0c0c0';
const bronzeColor = '#cd7f32';

function logCheevo(cheevo) {
  if (cheevo.trophy_id) {
    // #${cheevo.count} - ${cheevo.earned}
    return `Earned a ${prettyRarity(cheevo.rarity)} ${prettyType(
      cheevo.type
    )} in ${cheevo.game}
${cheevo.title} - ${cheevo.text}
`;
  } else if (cheevo.cheevo_id) {
    return `Earned a cheevo in ${cheevo.game}
${cheevo.title} - ${cheevo.text}
`;
  }
  return `Earned a Xbox cheevo worth ${cheevo.type}G in ${cheevo.game}
${cheevo.title} - ${cheevo.text}
`;
}

function prettyRarity(rarity) {
  if (rarity <= 1) return chalk.hex('#ffa040')('Legendary');
  if (rarity <= 5) return chalk.hex('#d040ff')('Ultra Rare');
  if (rarity <= 10) return chalk.cyan('Very Rare');
  if (rarity <= 20) return chalk.hex('#40d0ff')('Rare');
  if (rarity <= 50) return chalk.hex('#40ff40')('Uncommon');
  return 'Common';
}

function prettyType(type) {
  if (type) {
    let color = bronzeColor;
    if (type === 'Silver') color = silverColor;
    if (type === 'Gold') color = goldColor;
    if (type === 'Platinum') color = platinumColor;
    return chalk.hex(color)(type + ' trophy');
  }
  return 'cheevo';
}

function checkFile(fileName, fn) {
  fileName = `${__dirname}/../${fileName}.json`;

  if (fs.existsSync(fileName)) {
    const json = fs.readFileSync(fileName, 'utf8');
    const result = JSON.parse(json);
    return fn(result, countGames(result));
  }
}

function countGames(list) {
  const abc = list.reduce((acc, cur) => {
    acc[cur.game_id] = 0;
    return acc;
  }, {});
  return Object.keys(abc).length;
}

// let trophyStats = {
//   points: 0,
//   plats: 0,
//   golds: 0,
//   silvers: 0,
//   bronzes: 0,
// };

// trophies.reduce((acc, cur) => {
//   acc.points += trophy[cur.type];
//   if (trophy.Platinum === trophy[cur.type]) acc.plats++;
//   if (trophy.Gold === trophy[cur.type]) acc.golds++;
//   if (trophy.Silver === trophy[cur.type]) acc.silvers++;
//   if (trophy.Bronze === trophy[cur.type]) acc.bronzes++;
//   return acc;
// }, trophyStats);

function getPerTrophyCount(trophyStats) {
  let perTrophyCount = ` ${chalk.hex(platinumColor)('P')}${trophyStats.plats}`;
  perTrophyCount += `${chalk.hex(goldColor)('G')}${trophyStats.golds}`;
  perTrophyCount += `${chalk.hex(silverColor)('S')}${trophyStats.silvers}`;
  perTrophyCount += `${chalk.hex(bronzeColor)('B')}${trophyStats.bronzes}`;
  return perTrophyCount;
}

module.exports = { checkFile, countGames, getPerTrophyCount, logCheevo };
