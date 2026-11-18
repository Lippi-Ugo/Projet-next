import { LoginForm } from "./login-form";
import Link from "next/link";

export const metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte Drops.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/50 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20">
        <p className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Drops<span className="text-blue-700">.</span>
        </p>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.12em] text-blue-800 dark:text-blue-200">
          Votre espace
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Connexion
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          Utilisez votre identifiant ou votre adresse électronique pour vous
          connecter.
        </p>
        <div className="mt-7">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-zinc-700 dark:text-zinc-300">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-800 underline decoration-blue-300 underline-offset-4 hover:text-blue-900 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >
            Créer un compte
          </Link>
        </p>
      </section>
    </main>
  );
}
