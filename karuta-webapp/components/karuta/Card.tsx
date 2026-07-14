"use client";

import { motion } from "framer-motion";
import { Card as HeroCard } from "@heroui/react";
import type { KarutaCard } from "@/lib/karuta/types";
import Image from "next/image";
import { useState } from "react";

interface CardProps {
    card: KarutaCard;
    faceDown: boolean;
    rotated?: boolean;
    onClick?: () => void;
    disabled?: boolean; // Disable interactions
    delay?: number;
    size?: "sm" | "md" | "lg" | "fill"; // "fill" stretches the card size to the maximum available on the screen
}

const CARD_SIZE_CLASSES: Record<NonNullable<CardProps["size"]>, string> = {
    sm: "w-11 h-16",
    md: "w-14 h-20",
    lg: "w-17 h-24",
    fill: "",
};

export const FILL_FALLBACK = { width: "5rem", height: "7rem" };

export function Card({
    card,
    faceDown,
    rotated = false,
    onClick,
    disabled = false,
    delay = 0,
    size = "fill",
}: CardProps) {
    const interactive = Boolean(onClick) && !disabled;
    const [rightClickZoomed, setRightClickZoomed] = useState(false);

    const cardSize =
        size == "fill"
            ? {
                  width: `var(--karuta-card-w, ${FILL_FALLBACK.width})`,
                  height: `var(--karuta-card-h, ${FILL_FALLBACK.height})`,
              }
            : ({} as React.CSSProperties);

    return (
        <motion.div
            layoutId={card.id}
            layout
            className={`card-container ${size === "fill" ? "" : CARD_SIZE_CLASSES[size]}`}
            style={{
                perspective: 800,
                containerType: "inline-size",
                ...cardSize,
            }}
            whileHover={interactive ? { y: -8 } : undefined}
            whileFocus={interactive ? { y: -8 } : undefined}
            transition={{
                layout: { type: "spring", stiffness: 260, damping: 24, delay },
            }}
        >
            <motion.button
                type="button"
                onClick={onClick}
                onContextMenu={(event) => {
                    event.preventDefault();
                    if (interactive) setRightClickZoomed(!rightClickZoomed);
                }}
                onMouseLeave={() => setRightClickZoomed(false)}
                onBlur={() => setRightClickZoomed(false)}
                disabled={disabled || !onClick}
                aria-label={
                    faceDown ? "Face-down card" : (card.label ?? "Card")
                }
                className="relative h-full w-full cursor-pointer disabled:cursor-default [transform-style:preserve-3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[6px]"
                initial={false}
                animate={{
                    rotateY: faceDown ? 0 : 180,
                    rotateZ: rotated ? 180 : 0,
                }}
                whileHover={interactive ? { y: rightClickZoomed ? "-50%" : -4 } : undefined}
                whileTap={interactive ? { scale: 0.96 } : undefined}
                transition={{
                    rotateY: { duration: 0.45, ease: "easeInOut" },
                    // delay,
                }}
            >
                {/* Back face */}
                <HeroCard
                    variant="secondary"
                    className="absolute inset-0 overflow-hidden rounded-[6px] border-[var(--karuta-back-line,#c9a86a)]/40 shadow-sm [backface-visibility:hidden]"
                    style={{
                        background:
                            "repeating-linear-gradient(135deg, var(--karuta-back, #1e2a4a) 0 6px, var(--karuta-back-alt, #24345c) 6px 12px)",
                    }}
                >
                    <div className="absolute inset-[3px] rounded-[4px] border border-[var(--karuta-back-line,#c9a86a)]/50" />
                </HeroCard>

                {/* Front face */}
                <HeroCard
                    variant="default"
                    className="inset-0 rounded-[6px] border-border p-0 [backface-visibility:hidden]"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <motion.div
                        className="h-full w-full"
                        animate={{ scale: rightClickZoomed ? 2.3 : 1 }}
                        transition={{ type: "tween", duration: 0.15 }}
                        style={{ transformOrigin: "center center", willChange: "transform" }}
                    >
                        <Image
                            src={card.imageUrl}
                            alt={card.label ?? "Karuta card"}
                            width={816}
                            height={1110}
                            quality={100}
                            className="h-full w-full object-cover"
                            draggable={false}
                            style={{
                                perspective: 800,
                                containerType: "inline-size",
                                ...cardSize,
                            }}
                        />
                    </motion.div>
                </HeroCard>
            </motion.button>
        </motion.div>
    );
}
