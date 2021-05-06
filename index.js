const fs = require('fs');
let cheevos = [];
const cheevoFile = `${__dirname}/cheevos.json`;

if (fs.existsSync(cheevoFile)) {
  const json = fs.readFileSync(cheevoFile, 'utf8');
  cheevos = JSON.parse(json);
}

const cheevo = cheevos[Math.floor(Math.random() * cheevos.length)];

if (cheevo) {
  const cheevoInfo = `${prettyType(cheevo.type)} ${cheevo.title}\n${cheevo.game} - ${cheevo.text}\n${cheevo.earned}\n${prettyRarity(cheevo.rarity)} ${cheevo.rarity}%`;
  console.log(cheevoInfo);
} else {
  console.log('No cheevo data file.');
}

function prettyRarity(n) {
  if (n <= 5) return 'Ultra Rare';
  if (n <= 10) return 'Very Rare';
  if (n <= 20) return 'Rare';
  if (n <= 50) return 'Uncommon';
  return 'Common';
}

function prettyType(type) {
  switch(type) {
    case 1: return 'Bronze';
    case 2: return 'Silver';
    case 3: return 'Gold';
    case 4: return 'Platinum';
    default:
      return 'Cheevo';
  }
}

