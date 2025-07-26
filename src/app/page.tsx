import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-5 space-x-2">
      <Link className="font-medium text-sm px-4 py-1 rounded bg-primary text-white" href={'/auth/register'}>Register</Link>
      <Link className="font-medium text-sm px-4 py-1 rounded bg-primary text-white" href={'/auth/login'}>Login</Link>
    </main>
  );
}
