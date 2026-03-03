import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | PromptVault PIP",
  description: "Accede a la plataforma de inteligencia de prompts.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-pip-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-accent-foreground">P</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            PromptVault <span className="text-accent">PIP</span>
          </h1>
          <p className="mt-2 text-sm text-pip-400">
            Plataforma de Inteligencia de Prompts
          </p>
        </div>
        <LoginForm />
        <p className="mt-8 text-center text-xs text-pip-500">
          Digital Intelligence & Intelligence Automation Core
        </p>
        <p className="mt-2 text-center text-xs text-pip-600">
          © {new Date().getFullYear()} PromptVault Intelligence Platform
        </p>
      </div>
    </div>
  );
}
