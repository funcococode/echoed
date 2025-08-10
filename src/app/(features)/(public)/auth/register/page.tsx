"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import Button from "@/components/form/button";
import Input from "@/components/form/input";
import EchoCanvas from "@/components/canvas/echo-canvas";
import Logo from "@/components/ui/logo";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

type RegisterFields = {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    /** Optional UI-only field; stripped before submit */
    confirm?: string;
};

// ──────────────────────────────────────────────────────────────────────────────
// Helpers: password strength
// ──────────────────────────────────────────────────────────────────────────────

function scorePassword(pw: string) {
    let score = 0;
    if (!pw) return { score, label: "Too weak" } as const;

    // Length tiers
    if (pw.length >= 8) score += 1;
    if (pw.length >= 12) score += 1;

    // Variety
    const hasLower = /[a-z]/.test(pw);
    const hasUpper = /[A-Z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSymbol = /[^A-Za-z0-9]/.test(pw);
    const variety = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean)
        .length;
    if (variety >= 2) score += 1;
    if (variety >= 3) score += 1;

    // Labels 0..4
    const labels = ["Too weak", "Weak", "Okay", "Good", "Strong"] as const;
    return { score: Math.min(score, 4), label: labels[Math.min(score, 4)] } as const;
}

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
    const router = useRouter();
    const params = useSearchParams();
    const queryError = params.get("error");
    const [showPw, setShowPw] = useState(false);

    const { control, handleSubmit, watch, setError } = useForm<RegisterFields>({
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            username: "",
            password: "",
            confirm: "",
        },
    });

    const passwordValue = watch("password");
    const confirmValue = watch("confirm");
    const { score, label } = useMemo(
        () => scorePassword(passwordValue || ""),
        [passwordValue]
    );

    const onSubmit = async (values: RegisterFields) => {
        // Optional: confirm check (UI-only)
        if (values.confirm && values.password !== values.confirm) {
            setError("confirm", { message: "Passwords do not match" });
            return;
        }

        const payload = {
            firstname: values.firstname,
            lastname: values.lastname,
            email: values.email,
            username: values.username,
            password: values.password,
        };

        try {
            const response = (
                await axios.post("/api/auth/register", payload)
            )?.data as {
                message: string;
                success: boolean;
                data: { id: string } | null;
            };

            if (response?.success) {
                toast.success(response.message ?? "Account created", {
                    description: "Redirecting to login…",
                    richColors: true,
                });
                setTimeout(() => {
                    router.push("/auth/login?registered=1");
                }, 1000);
            } else {
                toast.error(response?.message ?? "Registration failed", {
                    richColors: true,
                });
            }
        } catch (err: unknown) {
            toast.error("Something went wrong. Please try again.", {
                richColors: true,
            });
        }
    };

    return (
        <main className="min-h-[90vh] grid md:grid-cols-5 rounded-2xl overflow-hidden border shadow-sm bg-white/50 dark:bg-neutral-900/50">
            {/* Left: form */}
            <section className="relative flex flex-col justify-center px-6 sm:px-10 py-10 col-span-2">
                <Link href={'/'} className="absolute top-5 left-6 sm:left-8 flex items-center gap-2">
                    <Logo />
                    <h1 className="font-semibold">Echoed</h1>
                </Link>

                <div className="mx-auto w-full max-w-md">
                    <header className="mb-8">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create your account
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Join Echoed and start sharing.
                        </p>
                    </header>

                    {queryError && (
                        <div className="mb-4 text-sm font-medium text-red-500">
                            {queryError}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                control={control}
                                name="firstname"
                                placeholder="Alex"
                            />
                            <Input
                                control={control}
                                name="lastname"
                                placeholder="Doe"
                            />
                        </div>

                        <Input
                            control={control}
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                        />

                        <Input
                            control={control}
                            name="username"
                            placeholder="user.name"
                        />

                        {/* Password field (strength, show/hide, caps, etc. handled by Input) */}
                        <Input
                            control={control}
                            name="password"
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            matchToValue={confirmValue}
                            matchToLabel="Confirm password"
                            showPasswordVisiblilityToggle
                            showPasswordStrength
                        />

                        {/* Confirm password shows match indicator vs the main password */}
                        <Input
                            control={control}
                            name="confirm"
                            type="password"
                            label="Confirm password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            matchToValue={passwordValue}
                            matchToLabel="Password"
                            showPasswordVisiblilityToggle
                        />

                        <div className="flex items-center justify-between text-xs text-neutral-500">
                            <Link href="/auth/login" className="hover:underline">
                                Have an account? Log in
                            </Link>
                            <span />
                        </div>

                        <Button text="Create account" type="submit" />
                    </form>

                    <p className="mt-6 text-[11px] text-neutral-400">
                        By creating an account, you agree to our Terms and acknowledge our
                        Privacy Policy.
                    </p>
                </div>
            </section>

            {/* Right: echo visuals */}
            <EchoCanvas />
        </main>
    );
}
