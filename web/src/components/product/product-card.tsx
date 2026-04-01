import { Link } from "react-router-dom";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, truncateText } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onDelete?: (product: Product) => void;
}

export function ProductCard({ product, isAdmin = false, onDelete }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden rounded-[28px] border-white/10 bg-slate-900/75 shadow-2xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-white/20">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <CardContent className="flex flex-col gap-5 p-5 text-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-white">{product.name}</h3>
            {product.category?.name ? (
              <Badge className="mt-3 border-white/10 bg-white/10 text-slate-100 hover:bg-white/15">{product.category.name}</Badge>
            ) : null}
          </div>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
            {formatCurrency(product.price)}
          </span>
        </div>

        <p className="text-sm leading-6 text-slate-300">{truncateText(product.description)}</p>

        <div className="flex flex-wrap gap-2">
          <Link className="flex-1" to={`/products/${product.id}`}>
            <Button className="w-full justify-between bg-slate-100 text-slate-950 hover:bg-white" variant="default">
              Detalhes
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          {isAdmin && (
            <>
              <Link to={`/admin/products/${product.id}/edit`}>
                <Button variant="secondary" className="border-white/10 bg-white/10 text-white hover:bg-white/15">
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </Link>
              <Button variant="destructive" className="bg-rose-500/90 hover:bg-rose-500" onClick={() => onDelete?.(product)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
