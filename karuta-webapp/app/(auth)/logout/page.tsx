import { signOutAction } from "@/app/actions/auth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignOutPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    
    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-3xl border border-border bg-card/90 p-8 text-center shadow-xl shadow-black/5 backdrop-blur-sm">
                <h1 className="mt-2 text-3xl font-semibold text-foreground">
                    Sign out
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    Confirm you want to end the current session.
                </p>

                <form action={signOutAction} className="mt-8">
                    <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                        Sign out
                    </button>
                </form>
            </div>
        </div>
    );
}