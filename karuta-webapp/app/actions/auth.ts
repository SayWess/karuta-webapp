"use server";
import { auth } from "@/lib/auth";
import {
    FormState,
    SignInFormSchema,
    SignupFormSchema,
} from "@/lib/definitions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";

export async function signUpAction(state: FormState, formData: FormData) {
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, password } = validatedFields.data;

    try {
        await auth.api.signUpEmail({
            body: { email, password, name },
        });
    } catch (error) {
        if (error instanceof APIError) {
            return { message: error.message ?? "Could not create account." };
        }
        throw error;
    }

    redirect("/");
}

export async function signInAction(state: FormState, formData: FormData) {
    const validatedFields = SignInFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { email, password } = validatedFields.data;

    try {
        await auth.api.signInEmail({
            body: { email, password },
        });
    } catch (error) {
        if (error instanceof APIError) {
            return { message: "Invalid email or password." };
        }
        throw error;
    }

    redirect("/");
}

export async function signOutAction() {
    await auth.api.signOut({
        headers: await headers(),
    });
    
    redirect("/");
}
