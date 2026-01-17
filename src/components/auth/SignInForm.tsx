"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginAdmin, recoverPassword } from "@/lib/actions/auth/actions";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"signin" | "recover">("signin");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [localError, setLocalError] = useState("");

  const { login, isLoading, error, clearError } = useAdminStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError("");
    setSuccessMessage("");

    if (!identifier) return;

    if (mode === "signin") {
      if (!password) return;
      const result = await login(identifier, password);
      if (result.success) {
        router.push("/");
      }
    } else {
      // Logic for recovery
      const res = await recoverPassword(identifier);
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setLocalError(res.message);
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "recover" : "signin");
    clearError();
    setLocalError("");
    setSuccessMessage("");
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="flex justify-center mb-10">
          <div className="relative p-1.5 bg-white rounded-full shadow-2xl dark:bg-gray-800 ring-4 ring-brand-500/10 dark:ring-brand-400/20 animate-float">
            <div className="overflow-hidden rounded-full w-40 h-40 flex items-center justify-center bg-white dark:bg-gray-900 border-4 border-gray-50 dark:border-gray-800">
              <Image
                src="/images/logo_news.png"
                alt="Logo ESURSI"
                width={350}
                height={350}
                className="object-contain transform scale-110"
                priority
              />
            </div>
          </div>
        </div>
        <div>
          <div className="mb-5 sm:mb-8 text-center sm:text-start">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {mode === "signin" ? "Connexion Admin" : "Récupération de compte"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mode === "signin"
                ? "Entrez votre email ou matricule et votre mot de passe pour vous connecter !"
                : "Entrez votre email ou matricule pour recevoir un nouveau mot de passe."}
            </p>
          </div>
          <div>
            {(error || localError) && (
              <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-lg dark:bg-red-500/10">
                {error || localError}
              </div>
            )}
            {successMessage && (
              <div className="p-3 mb-4 text-sm text-green-600 bg-green-100 rounded-lg dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                {successMessage}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email ou Matricule <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="info@gmail.com ou 1.234.567 A"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>

                {mode === "signin" && (
                  <div>
                    <Label>
                      Mot de passe <span className="text-error-500">*</span>{" "}
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Entrez votre mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    {mode === "signin" ? "Mot de passe oublié ?" : "Retour à la connexion"}
                  </button>
                </div>

                <div>
                  <Button
                    className="w-full"
                    size="sm"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Traitement en cours..."
                      : (mode === "signin" ? "Se connecter" : "Réinitialiser mon mot de passe")}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
