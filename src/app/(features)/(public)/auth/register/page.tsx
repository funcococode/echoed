"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import Button from "@/components/form/button";
import Input from "@/components/form/input";
import EchoCanvas from "@/components/canvas/echo-canvas";
import Logo from "@/components/ui/logo";
import EchoLoader from "@/components/ui/loaders/loader"; // assuming this exists
import { TbChecks } from "react-icons/tb";

type RegisterFields = {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    confirm?: string;
};

export default function RegisterPage() {
    const router = useRouter();
    const params = useSearchParams();
    const queryError = params.get("error");

    const [stage, setStage] = useState<"form" | "loading" | "success">("form");
    const [userName, setUserName] = useState("");
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

    const onSubmit = async (values: RegisterFields) => {
        if (values.confirm && values.password !== values.confirm) {
            setError("confirm", { message: "Passwords do not match" });
            return;
        }

        setUserName(`${values.firstname} ${values.lastname}`);
        setStage("loading");

        try {
            const response = (
                await axios.post("/api/auth/register", {
                    firstname: values.firstname,
                    lastname: values.lastname,
                    email: values.email,
                    username: values.username,
                    password: values.password,
                })
            )?.data;

            setTimeout(() => {
                if (response?.success) {
                    setStage("success");
                    setTimeout(() => {
                        router.push("/auth/login?registered=1");
                    }, 1500);
                } else {
                    toast.error(response?.message ?? "Registration failed", {
                        richColors: true,
                    });
                    setStage("form");
                }
            }, 2000);
        } catch {
            toast.error("Something went wrong. Please try again.", {
                richColors: true,
            });
            setStage("form");
        }
    };

    const fields = (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input control={control} name="firstname" placeholder="Alex" />
                <Input control={control} name="lastname" placeholder="Doe" />
            </div>
            <Input control={control} name="email" type="email" placeholder="you@example.com" />
            <Input control={control} name="username" placeholder="user.name" />
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
        </>
    );

    const staggerVariants = {
        initial: { opacity: 1, scale: 1 },
        exit: (i: number) => ({
            opacity: 0,
            scale: 0.8,
            transition: { delay: i * 0.05 },
        }),
    };

    return (
        <main className="min-h-[90vh] grid md:grid-cols-5 rounded-2xl overflow-hidden border shadow-sm bg-white/50 dark:bg-neutral-900/50">
            <section className="relative flex flex-col justify-center px-6 sm:px-10 py-10 col-span-2">
                <Link href="/" className="absolute top-5 left-6 sm:left-8 flex items-center gap-2">
                    <Logo />
                    <h1 className="font-semibold">Echoed</h1>
                </Link>

                <div className="mx-auto w-full max-w-md">
                    {stage === 'form' && <header className="mb-8">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create your account
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Join Echoed and start sharing.
                        </p>
                    </header>}

                    <AnimatePresence>
                        {stage === "form" && (
                            <motion.form
                                className="space-y-4"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                {fields?.props?.children?.map((field: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        variants={staggerVariants}
                                        initial="initial"
                                        exit="exit"
                                        custom={i}
                                    >
                                        {field}
                                    </motion.div>
                                ))}
                                <div className="flex items-center justify-between text-xs text-neutral-500">
                                    <Link href="/auth/login" className="hover:underline">
                                        Have an account? Log in
                                    </Link>
                                </div>
                                <Button text="Create account" type="submit" />
                            </motion.form>
                        )}

                        {stage === "loading" && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center gap-4 text-center"
                            >
                                <EchoLoader overlay={false} />
                                <p className="text-sm text-neutral-500">
                                    Hi {userName}, we’re creating your account…
                                </p>
                            </motion.div>
                        )}

                        {stage === "success" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-4 text-center"
                            >
                                <div className="p-4 text-4xl rounded-full bg-success-light flex items-center justify-center text-success ">
                                    <TbChecks />
                                </div>
                                <p className="text-sm text-green-600 font-medium">
                                    Account created successfully!
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            <EchoCanvas />
        </main>
    );
}
