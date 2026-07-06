"use client";
import { signUpAction } from "@/app/actions/auth";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useActionState } from "react";

export default function SignUp() {
    const router = useRouter();
    const [state, action, pending] = useActionState(signUpAction, undefined);
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (session) {
            router.replace("/");
        }
    }, [router, session]);

    if (isPending) {
        return (
            <div className="rounded-2xl border border-border bg-card px-6 py-4 text-sm text-muted-foreground shadow-sm">
                Loading...
            </div>
        );
    }

    if (session) {
        return (
            <div className="rounded-2xl border border-border bg-card px-6 py-4 text-sm text-muted-foreground shadow-sm">
                Redirecting to your account...
            </div>
        );
    }

    return (
        <div className="w-full max-w-md rounded-3xl border border-border bg-card/90 p-8 shadow-xl shadow-black/5 backdrop-blur-sm">
            <h1 className="text-3xl font-semibold text-foreground">
                Create an account
            </h1>

            <form action={action} className="mt-8 space-y-5">
                {state?.message && (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {state.message}
                    </div>
                )}

                <div className="space-y-2">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-foreground"
                    >
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="block w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="Jane Doe"
                    />
                    {state?.errors?.name && (
                        <p className="text-sm text-destructive">
                            {state.errors.name[0]}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="you@example.com"
                    />
                    {state?.errors?.email && (
                        <p className="text-sm text-destructive">
                            {state.errors.email[0]}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-foreground"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        className="block w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder="••••••••"
                    />
                    <p className="text-xs text-muted-foreground">
                        Use at least 8 characters with a number and a symbol.
                    </p>
                    {state?.errors?.password && (
                        <p className="text-sm text-destructive">
                            {state.errors.password[0]}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {pending ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <a
                    className="font-medium text-primary hover:underline"
                    href="/login"
                >
                    Sign in
                </a>
            </p>
        </div>
    );
}
