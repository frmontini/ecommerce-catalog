import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { PackagePlus, ShieldCheck, Store, Tags } from "lucide-react";
import { getCategories } from "@/api/categories";
import { deleteProduct, getProducts } from "@/api/products";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGridSkeleton } from "@/components/product/product-grid-skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/contexts/toast-context";

const highlights = [
  {
    title: "Catálogo público",
    description: "Lista, busca e filtros disponíveis sem precisar de login.",
    icon: Store,
  },
  {
    title: "Rotas protegidas",
    description: "Cadastro, edição e exclusão liberados apenas para usuários autenticados.",
    icon: ShieldCheck,
  },
  {
    title: "Organização por categorias",
    description: "Estrutura simples para manter a navegação mais clara.",
    icon: Tags,
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const hasFilters = useMemo(() => Boolean(search || category), [search, category]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => undefined);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadProducts();
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [page, search, category]);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);

      const response = await getProducts({
        page,
        search: search || undefined,
        category: category || undefined,
      });

      setProducts(response.items);
      setLastPage(response.meta.last_page || 1);
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data as { message?: string } | undefined)?.message || "Não foi possível carregar os produtos."
          : "Não foi possível carregar os produtos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
      toast({ title: "Produto removido", description: "O item foi removido com sucesso.", variant: "success" });
      await loadProducts();
    } catch {
      toast({ title: "Falha ao remover", description: "Não foi possível remover o produto agora.", variant: "error" });
    }
  }

  function handleClear() {
    setSearch("");
    setCategory("");
    setPage(1);
  }

  return (
    <>
      <div className="space-y-8 pb-10">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="card-surface p-7 sm:p-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                Catálogo de e-commerce
              </div>

              <div className="space-y-3">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Catálogo de Produtos
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Navegue pelos produtos, filtre por categoria e, quando estiver autenticado, gerencie o conteúdo do catálogo.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <Link to="/admin/products/new">
                    <Button className="h-11 rounded-full bg-slate-100 px-5 text-slate-950 hover:bg-white">
                      <PackagePlus className="mr-2 h-4 w-4" />
                      Novo produto
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button className="h-11 rounded-full bg-slate-100 px-5 text-slate-950 hover:bg-white">
                      Entrar para administrar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card-soft p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-semibold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <ProductFilters
          search={search}
          category={category}
          categories={categories}
          onSearchChange={(value) => {
            setPage(1);
            setSearch(value);
          }}
          onCategoryChange={(value) => {
            setPage(1);
            setCategory(value);
          }}
          onClear={handleClear}
        />

        {loading ? (
          <ProductGridSkeleton />
        ) : error ? (
          <EmptyState
            title="Não foi possível carregar os produtos"
            description={error}
            actionLabel="Tentar novamente"
            onAction={() => void loadProducts()}
          />
        ) : products.length === 0 ? (
          <EmptyState
            title={hasFilters ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
            description={
              hasFilters
                ? "Tente ajustar os filtros ou pesquisar por outro termo."
                : "Cadastre os primeiros produtos para começar a popular o catálogo."
            }
            actionLabel={hasFilters ? "Limpar filtros" : isAuthenticated ? "Novo produto" : "Criar conta"}
            onAction={
              hasFilters
                ? handleClear
                : () => {
                    if (isAuthenticated) {
                      window.location.href = "/admin/products/new";
                    } else {
                      window.location.href = "/register";
                    }
                  }
            }
          />
        ) : (
          <>
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdmin={isAuthenticated}
                  onDelete={(item) => setProductToDelete(item)}
                />
              ))}
            </section>

            <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/70 px-5 py-4 sm:flex-row">
              <p className="text-sm text-slate-300">
                Página <span className="font-semibold text-white">{page}</span> de{" "}
                <span className="font-semibold text-white">{lastPage}</span>
              </p>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="border-white/10 bg-white/8 text-white hover:bg-white/12"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Anterior
                </Button>
                <Button
                  className="bg-slate-100 text-slate-950 hover:bg-white"
                  disabled={page >= lastPage}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(productToDelete)}
        title="Excluir produto"
        description={`Deseja remover "${productToDelete?.name}" do catálogo?`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onCancel={() => setProductToDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}
