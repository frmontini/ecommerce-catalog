import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ShieldPlus, UserPlus } from "lucide-react";
import { register as registerUser } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

const schema = z
  .object({
    name: z.string().min(2, "Digite pelo menos 2 caracteres"),
    email: z.string().email("Digite um e-mail válido"),
    password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres"),
    password_confirmation: z.string().min(8, "Confirme a senha"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setServerError(null);
      const response = await registerUser(values);

      if (response.token) {
        signIn(response.token, response.user);
        navigate("/", { replace: true });
        return;
      }

      navigate("/login", { replace: true });
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string } | undefined)?.message || "Falha ao criar conta."
          : "Falha ao criar conta.";
      setServerError(message);
    }
  }

  return (
    <div className="mx-auto grid min-h-[72vh] max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="space-y-5 px-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
          <ShieldPlus className="h-4 w-4" />
          Cadastro de administrador
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-white">Crie sua conta para liberar o painel.</h1>
        <p className="max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
          Depois do cadastro você já pode autenticar, guardar o token e usar as rotas protegidas para gerenciar o conteúdo.
        </p>
      </div>

      <Card className="w-full rounded-[32px] border-white/10 bg-slate-900/75 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <CardHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
            <UserPlus className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl text-white">Criar conta</CardTitle>
          <CardDescription className="text-slate-400">Cadastre-se para gerenciar produtos e categorias.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <Label className="text-slate-200" htmlFor="name">Nome</Label>
              <Input className="mt-2" id="name" {...form.register("name")} />
              {form.formState.errors.name ? <p className="mt-1 text-sm text-rose-400">{form.formState.errors.name.message}</p> : null}
            </div>

            <div>
              <Label className="text-slate-200" htmlFor="email">E-mail</Label>
              <Input className="mt-2" id="email" type="email" {...form.register("email")} />
              {form.formState.errors.email ? <p className="mt-1 text-sm text-rose-400">{form.formState.errors.email.message}</p> : null}
            </div>

            <div>
              <Label className="text-slate-200" htmlFor="password">Senha</Label>
              <Input className="mt-2" id="password" type="password" {...form.register("password")} />
              {form.formState.errors.password ? <p className="mt-1 text-sm text-rose-400">{form.formState.errors.password.message}</p> : null}
            </div>

            <div>
              <Label className="text-slate-200" htmlFor="password_confirmation">Confirmar senha</Label>
              <Input
                className="mt-2"
                id="password_confirmation"
                type="password"
                {...form.register("password_confirmation")}
              />
              {form.formState.errors.password_confirmation ? (
                <p className="mt-1 text-sm text-rose-400">{form.formState.errors.password_confirmation.message}</p>
              ) : null}
            </div>

            {serverError ? <p className="text-sm text-rose-400">{serverError}</p> : null}

            <Button className="h-11 w-full bg-white text-slate-950 hover:bg-slate-100" disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-400">
            Já tem conta?{" "}
            <Link className="font-medium text-white hover:underline" to="/login">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
