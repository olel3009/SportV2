import { Feat } from "@/models/athlete";

export function findBestMedal(feats: Feat[] | undefined): Feat | undefined {
  if (!feats || feats.length === 0) {
    return undefined;
  }

  const medalRanks: { [medalName: string]: number } = {
    Gold: 3,
    Silber: 2,
    Bronze: 1
  };

  let bestRankAchieved = 0;
  let bestFeat: Feat | undefined = undefined;

  for (const feat of feats) {
    const medalNameOnFeat = feat.medal;
    if (medalNameOnFeat) {
      const currentRank = medalRanks[medalNameOnFeat] || 0;
      if (currentRank > 0 && currentRank > bestRankAchieved) {
        bestRankAchieved = currentRank;
        bestFeat = feat;
      }
    }
  }

  return bestFeat;
}