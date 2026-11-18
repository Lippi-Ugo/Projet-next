import Link from "next/link";
import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Inscription",
  description: "Créez un compte Drops.",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/50 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20">
        <p className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Drops<span className="text-blue-700">.</span>
        </p>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.12em] text-blue-800 dark:text-blue-200">
          Rejoindre la communauté
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Créer un compte
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          Quelques informations suffisent pour commencer à partager des drops.
        </p>
        <div className="mt-7">
          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-sm text-zinc-700 dark:text-zinc-300">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-800 underline decoration-blue-300 underline-offset-4 hover:text-blue-900 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >
            Se connecter
          </Link>
        </p>
      </section>
    </main>
  );
}
