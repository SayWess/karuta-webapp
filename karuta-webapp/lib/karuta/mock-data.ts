import type { KarutaCard } from "./types";

export function generateMockDeck(): KarutaCard[] {
  const owners: KarutaCard["owner"][] = ["player", "opponent"];
  const cards: KarutaCard[] = [];

  owners.forEach((owner) => {
    for (let i = 0; i < 30; i++) {
      cards.push({
        id: `${owner}-${i}`,
        imageUrl: `/card_test.png`,
        owner,
        status: "deck",
        slot: i,
        label: `${owner} card ${i + 1}`,
      });
    }
  });

  return cards;
}
