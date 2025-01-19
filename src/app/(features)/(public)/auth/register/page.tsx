'use client'
import Button from "@/components/form/button";
import Input from "@/components/form/input";
import axios from "axios";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form"
import { toast } from "sonner";

export interface RegisterFields{
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
}

export default function Register() {
  const {control, handleSubmit} = useForm<RegisterFields>({
    defaultValues: {
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
    }
  });

  const onSubmit = async (value: RegisterFields) => {
    const response = (await axios.post('/api/auth/register', value))?.data as {message: string, success: boolean, data: {id: string} | null};
    if(response.success){
        toast.success(response.message, {
            description:'Redirecting towards login page',
            richColors: true
        })
        setTimeout(() => {
            redirect('/auth/login')
        }, 1000)
    }else{
        toast.error(response.message, {
            richColors: true
        })
    }
  }

  return (
    <main className="rounded p-5 space-y-6 border">
        <h1 className="font-semibold text-lg">Register</h1>
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Input control={control} name="firstname" placeholder="John"/>
                <Input control={control} name="lastname" placeholder="Doe"/>
            </div>
            <Input control={control} name="email" placeholder="john@doe.com"/>
            <Input control={control} name="username" placeholder="john.doe"/>
            <Input control={control} name="password" placeholder="password" type="password"/>
        </div>
            <Button onClick={handleSubmit(onSubmit)} text="Register" />
    </main>

  )
}
