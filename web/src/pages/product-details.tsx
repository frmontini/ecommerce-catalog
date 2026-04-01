import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getProduct } from "@/api/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getProduct(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-[4/3] w-full rounded-[28px]" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <Card className="card-surface flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center text-white">
        <h1 className="text-2xl font-semibold">Produto não encontrado</h1>
        <p className="text-sm text-slate-300">Verifique se o item ainda existe ou volte para o catálogo.</p>
        <Link to="/">
          <Button className="bg-slate-100 text-slate-950 hover:bg-white">Voltar ao catálogo</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white" to="/">
        <ArrowLeft className="h-4 w-4" />
        Voltar ao catálogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="overflow-hidden rounded-[30px] border-white/10 bg-slate-900/75 shadow-2xl shadow-black/25">
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        </Card>

        <div className="card-surface space-y-6 p-8">
          <div className="space-y-3">
            {product.category?.name ? (
              <Badge className="border-white/10 bg-white/10 text-slate-100 hover:bg-white/15">{product.category.name}</Badge>
            ) : null}
            <h1 className="text-3xl font-semibold tracking-tight text-white">{product.name}</h1>
            <p className="text-2xl font-semibold text-emerald-300">{formatCurrency(product.price)}</p>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Descrição</h2>
            <p className="leading-7 text-slate-300">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
