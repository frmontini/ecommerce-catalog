import { Link, NavLink } from "react-router-dom";
import { LayoutGrid, PackagePlus, Shapes, ShoppingBag, UserRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const navigationItems = [
  { to: "/", label: "Catálogo", icon: LayoutGrid },
  { to: "/admin/products/new", label: "Novo produto", icon: PackagePlus, private: true },
  { to: "/admin/categories", label: "Categorias", icon: Shapes, private: true },
];

export function AppHeader() {
  const { isAuthenticated, user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="container-page flex h-18 min-h-[72px] items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Projeto</span>
            <span className="text-base text-slate-100">Catálogo de Produtos</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navigationItems
            .filter((item) => !item.private || isAuthenticated)
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
                      isActive
                        ? "bg-slate-100 text-slate-950 shadow-lg shadow-black/20"
                        : "text-slate-300 hover:bg-white/8 hover:text-white",
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 sm:flex">
                <UserRound className="h-4 w-4 text-slate-400" />
                <span>{user?.name || user?.email || "Usuário"}</span>
              </div>
              <button
                className={cn(buttonVariants({ variant: "outline" }), "border-white/15 bg-white/5 text-white hover:bg-white/10")}
                onClick={signOut}
                type="button"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link className={cn(buttonVariants({ variant: "ghost" }), "text-slate-200 hover:bg-white/10 hover:text-white")} to="/login">
                Entrar
              </Link>
              <Link className={cn(buttonVariants(), "bg-slate-100 text-slate-950 hover:bg-white")} to="/register">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
