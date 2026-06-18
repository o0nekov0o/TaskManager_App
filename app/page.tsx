import Link from "next/link"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">
        🚀 Task Manager App
      </h1>

      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </main>
  )
}