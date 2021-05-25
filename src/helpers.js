import chalk from 'chalk';
import fs from 'fs';
// const trophy = require('./trophy.js');
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const platinumColor = '#0000ff';
const goldColor = '#d4af37';
const silverColor = '#c0c0c0';
const bronzeColor = '#cd7f32';
const legendaryColor = '#ffa040';
const ultraRareColor = '#d040ff';
const rareColor = '#40d0ff';
const uncommonColor = '#40ff40';
const steamColor = '#2a475e';
const xboxColor = '#80bb03';
const psnColor = '#0070d1';
const trophy = '🏆';
const seperator = '📄';

function logCheevo(cheevo) {
  return `Earned a ${prettyCheevo(cheevo)} in ${chalk.hex(
    stringToColour(cheevo.game_id)
  )(cheevo.game)}\n${trophy} ${cheevo.title} ${seperator} ${cheevo.text}`;
}

function prettyCheevo(cheevo) {
  if (cheevo.trophy_id) {
    // #${cheevo.count} ${seperator} ${cheevo.earned}
    return `${prettyRarity(cheevo.rarity)} ${prettyType(cheevo.type)} on ${getColor(psnColor)('psn')}`;
  } else if (cheevo.cheevo_id) {
    return `cheevo on ${getColor(steamColor)('steam')}`;
  }
  return `cheevo on ${getColor(xboxColor)('xbox')} worth ${getColor(xboxColor)(`${cheevo.type}G`)}`;
}

function getColor(hex) {
  return chalk.hex(hex);
}

function prettyRarity(rarity) {
  if (rarity <= 1) return getColor(legendaryColor)('Legendary');
  if (rarity <= 5) return getColor(ultraRareColor)('Ultra Rare');
  if (rarity <= 10) return chalk.cyan('Very Rare');
  if (rarity <= 20) return getColor(rareColor)('Rare');
  if (rarity <= 50) return getColor(uncommonColor)('Uncommon');
  return 'Common';
}

function prettyType(type) {
  if (type) {
    let color = bronzeColor;
    if (type === 'Silver') color = silverColor;
    if (type === 'Gold') color = goldColor;
    if (type === 'Platinum') color = platinumColor;
    return getColor(color)(type + ' trophy');
  }
  return 'cheevo';
}

var stringToColour = function (str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
};

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

export { checkFile, countGames, getPerTrophyCount, logCheevo };
