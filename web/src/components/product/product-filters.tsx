import { Search, SlidersHorizontal } from "lucide-react";
import type { Category } from "@/types/category";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  search: string;
  category: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClear: () => void;
}

export function ProductFilters({
  search,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
  onClear,
}: ProductFiltersProps) {
  return (
    <div className="card-surface grid gap-4 p-4 md:grid-cols-[1.4fr_0.8fr_auto] md:items-end md:p-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-200">Buscar produto</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="h-11 pl-9"
            placeholder="Digite o nome ou descrição do produto"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-200">Categoria</label>
        <div className="relative">
          <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Select
            className="h-11 pl-9"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Button variant="secondary" className="h-11 border-white/10 bg-white/10 text-white hover:bg-white/15" onClick={onClear}>
        Limpar filtros
      </Button>
    </div>
  );
}
