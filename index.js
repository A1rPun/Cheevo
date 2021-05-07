const fs = require('fs');
let cheevos = [];
const cheevoFile = `${__dirname}/cheevos.json`;

if (fs.existsSync(cheevoFile)) {
  const json = fs.readFileSync(cheevoFile, 'utf8');
  cheevos = JSON.parse(json);
}

cheevos = cheevos.filter(x => x.type === 'Platinum');
const cheevo = cheevos[Math.floor(Math.random() * cheevos.length)];

if (cheevo) {
  const cheevoInfo = `
Earned a ${prettyType(cheevo.type)} in ${cheevo.game}
${cheevo.title} - ${cheevo.text}
#${cheevo.count} - ${cheevo.earned}
${prettyRarity(cheevo.rarity)} ${cheevo.rarity}%
`;
  console.log(cheevoInfo);
} else {
  console.log(`No cheevo data file in "${cheevoFile}".`);
}

function prettyRarity(n) {
  if (n <= 5) return 'Ultra Rare';
  if (n <= 10) return 'Very Rare';
  if (n <= 20) return 'Rare';
  if (n <= 50) return 'Uncommon';
  return 'Common';
}

function prettyType(type) {
  return type ? `${type} trophy` : 'cheevo';
}
