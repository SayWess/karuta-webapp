export type CardOwner = "player" | "opponent";

export type CardStatus =
  | "deck" // stacked in the center deck, not yet dealt
  | "board" // laid out in the owner's grid
  | "found"; // moved to the "found" pile at the side of the table

export interface KarutaCard {
  id: string;
  imageUrl: string;
  owner: CardOwner;
  status: CardStatus;
  foundOrder?: number; // Order in which the card was found (allows the card to be at the top of the pile when found)
  slot: number; // Slot of the card on the board
  label?: string; // card title.
}

export interface GameBoardProps {
  cards: KarutaCard[];
  onCardGuess?: (card: KarutaCard) => void;
  isMyTurn?: boolean;
}
