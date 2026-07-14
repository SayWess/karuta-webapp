"use client";

import { useRef, useState } from "react";
import { GameBoard } from "@/components/karuta/GameBoard";
import { generateMockDeck } from "@/lib/karuta/mock-data";
import type { KarutaCard } from "@/lib/karuta/types";

const SHUFFLE_FLOURISH_MS = 900;
const DEAL_INTERVAL_MS = 90;

export default function GameDemoPage() {
    const [cards, setCards] = useState<KarutaCard[]>(() => generateMockDeck());
    const [dealt, setDealt] = useState(false);
    const foundOrderRef = useRef(0);

    const dealTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

    function handleShuffleAndDeal() {
        // Cancel any deal still in flight before starting a new one.
        dealTimeouts.current.forEach(clearTimeout);
        dealTimeouts.current = [];

        let shuffledIds: string[] = [];

        setCards((prev) => {
            const deck = prev.filter((c) => c.status === "deck");
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
            shuffledIds = deck.map((c) => c.id);
            const rest = prev.filter((c) => c.status !== "deck");
            return [...deck, ...rest];
        });

        shuffledIds.forEach((id, i) => {
            const t = setTimeout(
                () => {
                    setCards((prev) =>
                        prev.map((c) =>
                            c.id === id ? { ...c, status: "board" } : c,
                        ),
                    );
                },
                SHUFFLE_FLOURISH_MS + i * DEAL_INTERVAL_MS,
            );
            dealTimeouts.current.push(t);
        });

        const doneTimeout = setTimeout(
            () => setDealt(true),
            SHUFFLE_FLOURISH_MS + shuffledIds.length * DEAL_INTERVAL_MS,
        );
        dealTimeouts.current.push(doneTimeout);

        setDealt(true);
    }

    function handleGuess(card: KarutaCard) {
        const foundOrder = foundOrderRef.current++;
        setCards((prev) =>
            prev.map((c) =>
                c.id === card.id ? { ...c, status: "found", foundOrder } : c,
            ),
        );
    }

    return (
        <div className="mx-auto min-w-[100vw] md:min-w-[90vw]">
            <GameBoard
                cards={cards}
                onCardGuess={dealt ? handleGuess : undefined}
            />

            <div className="mb-4 flex items-center justify-between">
                <button
                    type="button"
                    onClick={handleShuffleAndDeal}
                    disabled={dealt}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
                >
                    Shuffle &amp; deal
                </button>
            </div>
        </div>
    );
}
