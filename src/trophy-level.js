function getTrophyLevelProgression(points) {
  const levels = [60, 90];
  let level = 1;
  let currentRange = 0;
  let levelInc;

  while (points > 0) {
    const levelMultiplier = level === 1 ? 99 : 100;
    levelInc =
      currentRange < 2 ? levels[currentRange] : 450 * (currentRange - 1);

    if (levelInc * levelMultiplier < points) {
      currentRange++;
      level += levelMultiplier;
      points -= levelInc * levelMultiplier;
    } else {
      points -= levelInc;

      if (points > 0) {
        level += 1;
      }
    }
  }
  const percent = Math.floor(((levelInc - Math.abs(points)) / levelInc) * 100);
  return [level, percent];
}

module.exports = getTrophyLevelProgression;
