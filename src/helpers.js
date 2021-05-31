import chalk from 'chalk';
import fs from 'fs';
import getTrophyLevelProgression from './trophy-level.js';
import trophyPoints from './trophy-points.js';
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

function logCheevos(cheevos) {
  let cheevoInfo = cheevos.reduce(
    (acc, cur) => acc + logCheevo(cur) + '\n\n',
    '\n'
  );
  return cheevoInfo.slice(0, -1);
}

function logCheevoDetails(files, cheevoData) {
  const [cheevoFile, xboxCheevoFile, trophyFile] = files;
  let cheevoDetail = `Total cheevos: ${cheevoData.total.cheevos.length} in ${cheevoData.total.gameCount} games\n`;

  if (cheevoData[cheevoFile].cheevos.length)
    cheevoDetail += `${getColor(steamColor)('Steam')}: ${
      cheevoData[cheevoFile].cheevos.length
    } cheevos in ${cheevoData[cheevoFile].gameCount} games\n`;

  if (cheevoData[xboxCheevoFile].cheevos.length)
    cheevoDetail += `${getColor(xboxColor)('Xbox')}: ${
      cheevoData[xboxCheevoFile].cheevos.length
    } cheevos in ${cheevoData[xboxCheevoFile].gameCount} games\n`;

  if (cheevoData[trophyFile].cheevos.length)
    cheevoDetail += `${getColor(psnColor)('PSN')}: ${
      cheevoData[trophyFile].cheevos.length
    } trophies in ${cheevoData[trophyFile].gameCount} games\n`;

  return cheevoDetail;
}

function logCheevo(cheevo) {
  return `🎮 Earned a ${prettyCheevo(cheevo)} in ${chalk.hex(
    stringToColour(cheevo.game_id)
  )(cheevo.game)}\n${trophy} ${cheevo.title} ${seperator} ${cheevo.text}${
    cheevo.count || cheevo.earned ? '\n' : ''
  }${cheevo.count ? `#️⃣  ${cheevo.count} ` : ''}${
    cheevo.earned
      ? `📅 ${new Date(cheevo.earned).toLocaleDateString('nl')}`
      : ''
  }`;
}

function prettyCheevo(cheevo) {
  if (cheevo.trophy_id) {
    return `${prettyRarity(cheevo.rarity)}${prettyType(
      cheevo.type
    )} on ${getColor(psnColor)('psn')}`;
  } else if (cheevo.cheevo_id) {
    return `${prettyRarity(cheevo.rarity)}cheevo on ${getColor(steamColor)(
      'steam'
    )}`;
  }
  return `${prettyRarity(cheevo.rarity)}cheevo on ${getColor(xboxColor)(
    'xbox'
  )} worth ${getColor(xboxColor)(`${cheevo.type}G`)}`;
}

function getColor(hex) {
  return chalk.hex(hex);
}

function prettyRarity(rarity) {
  if (!rarity) return '';
  if (rarity <= 1) return getColor(legendaryColor)('Legendary ');
  if (rarity <= 5) return getColor(ultraRareColor)('Ultra Rare ');
  if (rarity <= 10) return chalk.cyan('Very Rare ');
  if (rarity <= 20) return getColor(rareColor)('Rare ');
  if (rarity <= 50) return getColor(uncommonColor)('Uncommon ');
  return 'Common ';
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

function getTypeCount(trophyStats) {
  let typeCount = `${getColor(platinumColor)(trophyStats.plats)} Platinum `;
  typeCount += `${getColor(goldColor)(trophyStats.golds)} Gold `;
  typeCount += `${getColor(silverColor)(trophyStats.silvers)} Silver `;
  typeCount += `${getColor(bronzeColor)(trophyStats.bronzes)} Bronze`;
  return typeCount;
}

function getRarityCount(trophyStats) {
  let rarityCount = `${getColor(legendaryColor)(
    trophyStats.legend
  )} Legendary `;
  rarityCount += `${getColor(ultraRareColor)(trophyStats.ultra)} Ultra Rare `;
  rarityCount += `${chalk.cyan(trophyStats.very)} Very Rare `;
  rarityCount += `${getColor(rareColor)(trophyStats.rare)} Rare `;
  rarityCount += `${getColor(uncommonColor)(trophyStats.uncommon)} Uncommon `;
  rarityCount += `${trophyStats.common} Common `;
  return rarityCount;
}

function logCheevoExtra(files, cheevoData) {
  const [cheevoFile, xboxCheevoFile, trophyFile] = files;
  let cheevoExtra = ``;

  // if (cheevoData[cheevoFile].cheevos.length) {
  //   cheevoExtra += `${getColor(steamColor)('Steam')}: \n`;
  // }

  if (cheevoData[xboxCheevoFile].cheevos.length) {
    const xboxCheevoGamerScore = cheevoData[xboxCheevoFile].cheevos.reduce(
      (acc, cur) => acc + parseInt(cur.type, 10),
      0
    );
    cheevoExtra += `${getColor(xboxColor)('Xbox')}:\n ${getColor(xboxColor)(
      xboxCheevoGamerScore
    )} Gamerscore\n`;
  }

  if (cheevoData[trophyFile].cheevos.length) {
    const trophyStats = cheevoData[trophyFile].cheevos.reduce(
      (acc, cur) => {
        acc.points += trophyPoints[cur.type];
        if (trophyPoints.Platinum === trophyPoints[cur.type]) acc.plats++;
        if (trophyPoints.Gold === trophyPoints[cur.type]) acc.golds++;
        if (trophyPoints.Silver === trophyPoints[cur.type]) acc.silvers++;
        if (trophyPoints.Bronze === trophyPoints[cur.type]) acc.bronzes++;
        if (cur.rarity <= 1) acc.legend++;
        else if (cur.rarity <= 5) acc.ultra++;
        else if (cur.rarity <= 10) acc.very++;
        else if (cur.rarity <= 20) acc.rare++;
        else if (cur.rarity <= 50) acc.uncommon++;
        else acc.common++;
        return acc;
      },
      {
        points: 0,
        plats: 0,
        golds: 0,
        silvers: 0,
        bronzes: 0,
        legend: 0,
        ultra: 0,
        very: 0,
        rare: 0,
        uncommon: 0,
        common: 0,
      }
    );
    const [level, percent] = getTrophyLevelProgression(trophyStats.points);
    cheevoExtra += `${getColor(psnColor)(
      'PSN'
    )}:\n level ${level} ${percent}%\n`;
    cheevoExtra += ` ${getTypeCount(trophyStats)}\n`;
    cheevoExtra += ` ${getRarityCount(trophyStats)}\n`;
  }
  return cheevoExtra;
}

export { checkFile, logCheevoExtra, logCheevos, logCheevoDetails };
