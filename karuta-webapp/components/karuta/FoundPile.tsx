"use client";

import { Card, FILL_FALLBACK } from "./Card";
import type { KarutaCard } from "@/lib/karuta/types";

interface FoundPileProps {
    cards: KarutaCard[];
    owner: "player" | "opponent";
    label: string;
    size?: "sm" | "md" | "lg" | "fill";
}

export function FoundPile({ cards, owner, label, size="fill" }: FoundPileProps) {
    const orderedCards = [...cards].sort((left, right) => {
        const leftOrder = left.foundOrder ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = right.foundOrder ?? Number.MAX_SAFE_INTEGER;
        return leftOrder - rightOrder;
    });

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={`relative`}
                style={{
                    ...(size === "fill"
                        ? {
                              width: `var(--karuta-card-w, ${FILL_FALLBACK.width})`,
                              height: `var(--karuta-card-h, ${FILL_FALLBACK.height})`,
                          }
                        : {}),
                }}
            >
                {orderedCards.length === 0 && (
                    <div className="absolute inset-0 rounded-[6px] border border-dashed border-border" />
                )}
                {orderedCards.map((card, i) => (
                    <div
                        key={card.id}
                        className="absolute"
                        style={{
                            top: -i * 0.3,
                            left: i * 0.3,
                            zIndex: i,
                        }}
                    >
                        <Card
                            card={card}
                            faceDown={false}
                            rotated={owner === "opponent"}
                            disabled
                        />
                    </div>
                ))}
            </div>

            <span className="text-xs text-muted-foreground">
                {cards.length} found
            </span>
        </div>
    );
}
