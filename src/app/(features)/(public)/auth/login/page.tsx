'use client'
import Button from "@/components/form/button";
import Input from "@/components/form/input"
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form"


export type LoginFields = Record<string, string>

export default function Login() {
  const {control, handleSubmit} = useForm<LoginFields>({
    defaultValues: {
        username: '',
        password: ''
    }
  });

  const router = useSearchParams();
  const error = router.get('error');  
  const errorMessages = {
    CredentialsSignin: 'Invalid credentials, please try again.',
    Default: 'An unknown error occurred, please try again later.',
  };

  const onSubmit = async (values: LoginFields) => {
    await signIn('credentials', {
        ...values, 
        redirectTo:'/'
    })
  }

  return (
    <main className="rounded p-5 space-y-4 border">
        <h1 className="font-semibold text-lg">Login</h1>
        {error && (
          <div className="text-sm font-medium text-red-500">
            {errorMessages[error] || errorMessages.Default}
          </div>
        )}
        <div className="space-y-4">
            <Input control={control} name="username" placeholder="user.name"/>
            <Input control={control} name="password" placeholder="password" type="password"/>
            <Button onClick={handleSubmit(onSubmit)} text="Login" />
            <Link className='block text-xs text-gray-400' href={'/auth/register'}>Register</Link>
        </div>
    </main>
  )
}
