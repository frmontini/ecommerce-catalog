import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { login } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

const schema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(1, "Digite sua senha"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setServerError(null);
      const response = await login(values);

      if (!response.token) {
        setServerError("A API não retornou um token válido.");
        return;
      }

      signIn(response.token, response.user);
      const redirectTo = (location.state as { from?: string } | null)?.from || "/";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string } | undefined)?.message || "Falha ao autenticar."
          : "Falha ao autenticar.";
      setServerError(message);
    }
  }

  return (
    <div className="mx-auto grid min-h-[72vh] max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="space-y-5 px-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
          <ShieldCheck className="h-4 w-4" />
          Área protegida
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-white">Entre para administrar o catálogo.</h1>
        <p className="max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
          O catálogo é público, mas as ações de cadastro, edição e exclusão ficam reservadas para usuários autenticados.
        </p>
      </div>

      <Card className="w-full rounded-[32px] border-white/10 bg-slate-900/75 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <CardHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl text-white">Entrar</CardTitle>
          <CardDescription className="text-slate-400">Use seu usuário para acessar as rotas protegidas do catálogo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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

            {serverError ? <p className="text-sm text-rose-400">{serverError}</p> : null}

            <Button className="h-11 w-full bg-white text-slate-950 hover:bg-slate-100" disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-400">
            Ainda não tem conta?{" "}
            <Link className="font-medium text-white hover:underline" to="/register">
              Criar conta
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
