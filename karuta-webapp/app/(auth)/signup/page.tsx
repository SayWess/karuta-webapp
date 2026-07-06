"use client";
import { signUpAction } from "@/app/actions/auth";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useActionState } from "react";

export default function SignUp() {
    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch, //refetch the session
    } = authClient.useSession();

    if (session) {
        redirect("/");
    }

    const [state, action, pending] = useActionState(signUpAction, undefined);

    return (
        <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm space-y-8">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        Create an account
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your details to get started.
                    </p>
                </div>

                <form action={action} className="space-y-5">
                    {state?.message && (
                        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {state.message}
                        </div>
                    )}
                    <div>
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
                            className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Jane Doe"
                        />
                    </div>
                    {state?.errors?.name && <p>{state.errors.name}</p>}

                    <div>
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
                            className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="you@example.com"
                        />
                    </div>
                    {state?.errors?.email && <p>{state.errors.email}</p>}

                    <div>
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
                            className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="••••••••"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                            At least 8 characters.
                        </p>
                    </div>
                    {state?.errors?.password && (
                        <div>
                            <p>Password must:</p>
                            <ul>
                                {state.errors.password.map((error) => (
                                    <li key={error}>- {error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={pending}
                        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        Create account
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <a
                        href="/signin"
                        className="font-medium text-primary hover:underline"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
