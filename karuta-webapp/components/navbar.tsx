"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

import { authClient } from "@/lib/auth-client";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: session, isPending, refetch } = authClient.useSession();

    useEffect(() => {
        void refetch();
    }, [pathname, refetch]);

    const authLinks = session
        ? [{ label: "Logout", href: "/logout" }]
        : [
              { label: "Login", href: "/login" },
              { label: "Register", href: "/register" },
          ];

    if (pathname.startsWith("/game")) {
        return;
    }

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
            <header className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-6">
                <div className="flex items-center gap-4">
                    <NextLink className="flex items-center gap-1" href="/">
                        <Logo />
                        <p className="font-bold text-inherit">KARUTA</p>
                    </NextLink>
                    <ul className="hidden lg:flex gap-4 ml-2">
                        {siteConfig.navItems.map((item) => {
                            const isActive =
                                item.href === "/"
                                    ? pathname === "/"
                                    : pathname.startsWith(item.href);

                            return (
                                <li key={item.href}>
                                    <NextLink
                                        className={clsx(
                                            "text-foreground hover:text-accent transition-colors",
                                            "data-[active=true]:text-accent data-[active=true]:font-medium",
                                            isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                        )}
                                        href={item.href}
                                    >
                                        {item.label}
                                    </NextLink>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                    {!isPending && (
                        <div className="flex items-center gap-2">
                            {authLinks.map((item) => (
                                <NextLink
                                    key={item.href}
                                    className={clsx(
                                        "rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-accent",
                                        item.href === "/logout" &&
                                            "text-danger hover:text-danger/80",
                                    )}
                                    href={item.href}
                                >
                                    {item.label}
                                </NextLink>
                            ))}
                        </div>
                    )}
                    <ThemeSwitch />
                </div>

                <div className="flex sm:hidden items-center gap-2">
                    <ThemeSwitch />
                    <button
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle menu"
                        className="p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path
                                    d="M6 18L18 6M6 6l12 12"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                />
                            ) : (
                                <path
                                    d="M4 6h16M4 12h16M4 18h16"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </header>

            {isMenuOpen && (
                <div className="border-t border-separator sm:hidden">
                    <ul className="flex flex-col gap-2 px-4 py-4">
                        {siteConfig.navItems.map((item) => (
                            <li key={item.href}>
                                <NextLink
                                    className="block rounded-2xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted/60 hover:text-accent"
                                    href={item.href}
                                >
                                    {item.label}
                                </NextLink>
                            </li>
                        ))}
                        <li className="pt-2">
                            <div className="rounded-2xl border border-border bg-card/80 p-2">
                                {isPending ? (
                                    <div className="h-11 rounded-xl bg-muted/60" />
                                ) : (
                                    authLinks.map((item) => (
                                        <NextLink
                                            key={item.href}
                                            className={clsx(
                                                "block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                                                item.href === "/logout"
                                                    ? "text-danger hover:bg-danger/10"
                                                    : "text-foreground hover:bg-muted/60 hover:text-accent",
                                            )}
                                            href={item.href}
                                        >
                                            {item.label}
                                        </NextLink>
                                    ))
                                )}
                            </div>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}
