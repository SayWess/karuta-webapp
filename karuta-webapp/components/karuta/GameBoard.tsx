"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "./Card";
import { FoundPile } from "./FoundPile";
import type { GameBoardProps, KarutaCard } from "@/lib/karuta/types";

const SLOTS_PER_OWNER = 30; // 3 rows x 10 columns
const GRID_ROWS = 3;
const GRID_COLS = 10;
const GRID_GAP_PX = 16; // matches gap-4 on each CardGrid
const OUTER_GAP_PX = 12; // matches gap-3 between opponent grid / deck / player grid
const CARD_ASPECT = 5 / 7; // width / height


function useFitCardSize(
    wrapperRef: React.RefObject<HTMLElement | null>,
    deckRef: React.RefObject<HTMLElement | null>,
    deckVisible: boolean,
) {
    const [size, setSize] = useState({ w: 80, h: 112 });

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const compute = () => {
            const wrapperRect = wrapper.getBoundingClientRect();
            const deckHeight = deckVisible
                ? (deckRef.current?.getBoundingClientRect().height ?? 0)
                : 0;

            const availableHeight =
                wrapperRect.height - deckHeight - OUTER_GAP_PX * 2;
            const availableWidth = wrapperRect.width;

            // Height allowed per single card row, across both grids stacked together.
            const heightPerRow =
                (availableHeight - GRID_GAP_PX * (GRID_ROWS - 1) * 2) /
                (GRID_ROWS * 2);

            // Height allowed per card if instead constrained by column width.
            const widthPerCol =
                (availableWidth - GRID_GAP_PX * (GRID_COLS - 1)) / GRID_COLS;
            const heightFromWidth = widthPerCol / CARD_ASPECT;

            const finalHeight = Math.max(
                24,
                Math.min(heightPerRow, heightFromWidth),
            );
            const finalWidth = finalHeight * CARD_ASPECT;

            setSize({ w: Math.floor(finalWidth), h: Math.floor(finalHeight) });
        };

        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(wrapper);
        if (deckRef.current) ro.observe(deckRef.current);
        window.addEventListener("resize", compute);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", compute);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deckVisible]);

    return size;
}

export function GameBoard({
    cards,
    onCardGuess,
    isMyTurn = true,
}: GameBoardProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const deckRowRef = useRef<HTMLDivElement>(null);

    const deck = useMemo(
        () => cards.filter((c) => c.status === "deck"),
        [cards],
    );
    const opponentBoard = useMemo(
        () =>
            cards.filter((c) => c.owner === "opponent" && c.status === "board"),
        [cards],
    );
    const playerBoard = useMemo(
        () => cards.filter((c) => c.owner === "player" && c.status === "board"),
        [cards],
    );
    const deck1Found = useMemo(
        () => cards.filter((c) => c.owner === "player" && c.status === "found"),
        [cards],
    );

    const deck2Found = useMemo(
        () =>
            cards.filter((c) => c.owner === "opponent" && c.status === "found"),
        [cards],
    );

    const cardSize = useFitCardSize(wrapperRef, deckRowRef, deck.length > 0);
    const cardVars = {
        "--karuta-card-w": `${cardSize.w}px`,
        "--karuta-card-h": `${cardSize.h}px`,
    } as React.CSSProperties;

    return (
        <LayoutGroup>
            <div
                className={`flex h-screen w-full flex-col justify-center gap-3 p-4`}
                style={{
                    background:
                        "radial-gradient(ellipse at center, var(--karuta-table, #2f4a3d) 0%, var(--karuta-table-edge, #22362d) 100%)",
                }}
            >
                <div // gets mesured to determine the cards optimal dimensions later
                    ref={wrapperRef}
                    className="flex flex-1 min-h-0 flex-col justify-center gap-3"
                    style={cardVars}
                >
                    {/* Opponent's board (rotated 180deg) */}
                    <CardGrid
                        cards={opponentBoard}
                        rotated
                        onCardGuess={onCardGuess}
                    />

                    {/* Shown only while cards remain undealt */}
                    <div
                        ref={deckRowRef}
                        className="flex shrink-0 items-center justify-center"
                    >
                        <AnimatePresence>
                            {deck.length > 0 && (
                                <motion.div
                                    className="relative"
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    {deck.map((card, i) => (
                                        <div
                                            key={card.id}
                                            className="absolute inset-0"
                                            style={{ zIndex: i }}
                                        >
                                            <motion.div
                                                animate={{
                                                    rotate: [
                                                        0,
                                                        i % 2 === 0 ? -3 : 3,
                                                        0,
                                                    ],
                                                    y: [0, -2, 0],
                                                }}
                                                transition={{
                                                    duration: 1.6,
                                                    repeat: Infinity,
                                                    delay: i * 0.08,
                                                    ease: "easeInOut",
                                                }}
                                            >
                                                <Card
                                                    card={card}
                                                    faceDown
                                                />
                                            </motion.div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Player board */}
                    <CardGrid cards={playerBoard} onCardGuess={onCardGuess} />
                </div>

                {/* Cards found */}
                <div className="absolute justify-center px-2" style={cardVars}>
                    <FoundPile
                        cards={deck2Found}
                        owner="opponent"
                        label="Deck 1"
                    />

                    <div className="h-20" />

                    <FoundPile
                        cards={deck1Found}
                        owner="player"
                        label="Deck 2"
                    />
                </div>
            </div>
        </LayoutGroup>
    );
}

function CardGrid({
    cards,
    rotated = false,
    onCardGuess,
    disabled,
}: {
    cards: KarutaCard[];
    rotated?: boolean;
    onCardGuess?: (card: KarutaCard) => void;
    disabled?: boolean;
}) {
    const bySlot = useMemo(() => {
        const map = new Map<number, KarutaCard>();
        cards.forEach((c) => map.set(c.slot, c));
        return map;
    }, [cards]);

    return (
        <div
            className="hover:z-10  mx-auto grid w-fit grid-cols-10 grid-rows-3 place-items-center gap-4"
            style={{ transform: rotated ? "rotate(180deg)" : undefined }}
        >
            {Array.from({ length: SLOTS_PER_OWNER }).map((_, slot) => {
                const card = bySlot.get(slot);

                // Empty slot when a card is found, so the rest of the row doesn't move
                if (!card) {
                    return (
                        <div
                            key={`hole-${slot}`}
                            style={{
                                width: "var(--karuta-card-w)",
                                height: "var(--karuta-card-h)",
                            }}
                        />
                    );
                }

                return (
                    <Card
                        key={card.id}
                        card={card}
                        faceDown={false}
                        onClick={
                            onCardGuess ? () => onCardGuess(card) : undefined
                        }
                        disabled={disabled}
                        delay={slot * 0.015}
                    />
                );
            })}
        </div>
    );
}
