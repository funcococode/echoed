"use client";

import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

import Button from "@/components/form/button";
import Input from "@/components/form/input";
import EchoCanvas from "@/components/canvas/echo-canvas";
import Logo from "@/components/ui/logo";
import { TbChecks } from "react-icons/tb";
import { useEffect, useState } from "react";

export type LoginFields = Record<string, string>;

export default function Login() {
  const { control, handleSubmit } = useForm<LoginFields>({
    defaultValues: { username: "", password: "" },
  });
  const router = useSearchParams();
  const error = router.get("error");
  const registered = router.get('registered') === '1';
  const [showRegistered, setShowRegistered] = useState(registered);

  const errorMessages: Record<string, string> = {
    CredentialsSignin: "Invalid credentials, please try again.",
    Default: "An unknown error occurred, please try again later.",
  };

  const onSubmit = async (values: LoginFields) => {
    await signIn("credentials", { ...values, callbackUrl: "/feed" });
  };

  useEffect(() => {
    if (showRegistered) {
      setTimeout(() => setShowRegistered(false), 10000)
    }
  }, [])

  return (
    <main className="min-h-[90vh] grid md:grid-cols-5 rounded-2xl overflow-hidden border shadow-sm bg-white/50 dark:bg-neutral-900/50">
      {/* Left: form */}
      <section className="relative flex flex-col justify-center px-6 sm:px-10 py-10 col-span-2">
        <Link href={'/'} className="absolute top-5 left-6 sm:left-8 flex items-center gap-2">
          <Logo />
          <h1 className="font-semibold text">Echoed</h1>
        </Link>

        <div className="mx-auto w-full max-w-md">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-neutral-500 mt-1">Log in to continue to your feed.</p>
          </header>

          {error && (
            <div className="mb-4 text-sm font-medium text-red-500">
              {errorMessages[error] || errorMessages.Default}
            </div>
          )}

          {showRegistered && (
            <div className="mb-4 text-sm font-medium bg-success-light text-success rounded-md p-4 flex items-center gap-2">
              <TbChecks />
              <p>Your account has been created successfully</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input control={control} name="username" placeholder="user.name" label="Username" showCounter />
            <Input control={control} name="password" placeholder="••••••••" type="password" label="Password" showPasswordVisiblilityToggle />
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <Link href="/auth/forgot" className="hover:underline">Forgot password?</Link>
              <Link href="/auth/register" className="hover:underline">Create an account</Link>
            </div>
            <Button text="Login" type="submit" />
          </form>

          <p className="mt-6 text-[11px] text-neutral-400">
            By continuing, you agree to our Terms and acknowledge our Privacy Policy.
          </p>
        </div>
      </section>

      {/* Right: Echo visuals */}
      <EchoCanvas />
    </main>
  );
}

