import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/api/categories";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/contexts/toast-context";
import type { Category } from "@/types/category";

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    void loadCategories();
  }, []);

  async function loadCategories() {
    const result = await getCategories();
    setCategories(result);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);

      if (editingId) {
        await updateCategory(editingId, { name: name.trim() });
        toast({ title: "Categoria atualizada", description: "As alterações foram salvas com sucesso.", variant: "success" });
      } else {
        await createCategory({ name: name.trim() });
        toast({ title: "Categoria salva", description: "A nova categoria já está disponível no catálogo.", variant: "success" });
      }

      setName("");
      setEditingId(null);
      await loadCategories();
    } catch {
      toast({ title: "Falha ao salvar", description: "Não foi possível concluir a operação agora.", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      toast({ title: "Categoria removida", description: "A categoria foi removida com sucesso.", variant: "success" });
      await loadCategories();
    } catch {
      toast({ title: "Falha ao remover", description: "A categoria não pôde ser removida agora.", variant: "error" });
    }
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-white/10 bg-slate-900/75">
          <CardHeader>
            <CardTitle className="text-white">{editingId ? "Editar categoria" : "Nova categoria"}</CardTitle>
            <CardDescription className="text-slate-400">Gerencie as categorias disponíveis no catálogo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label className="text-slate-200" htmlFor="name">Nome da categoria</Label>
                <Input className="mt-2" id="name" value={name} onChange={(event) => setName(event.target.value)} />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button className="bg-slate-100 text-slate-950 hover:bg-white" disabled={loading} type="submit">
                  {loading ? "Salvando..." : editingId ? "Atualizar" : "Salvar"}
                </Button>
                {editingId ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                    onClick={() => {
                      setEditingId(null);
                      setName("");
                    }}
                  >
                    Cancelar
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/75">
          <CardHeader>
            <CardTitle className="text-white">Categorias cadastradas</CardTitle>
            <CardDescription className="text-slate-400">Use editar e excluir para testar as rotas protegidas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="font-medium text-white">{category.name}</p>
                  <p className="text-sm text-slate-400">ID: {category.id}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="border-white/10 bg-white/10 text-white hover:bg-white/15"
                    onClick={() => {
                      setEditingId(category.id);
                      setName(category.name);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button variant="destructive" className="bg-rose-500/90 hover:bg-rose-500" onClick={() => setCategoryToDelete(category)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}

            {categories.length === 0 ? <p className="text-sm text-slate-400">Nenhuma categoria cadastrada.</p> : null}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(categoryToDelete)}
        title="Excluir categoria"
        description={categoryToDelete ? `Deseja remover a categoria \"${categoryToDelete.name}\"?` : ""}
        confirmLabel="Excluir"
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={() => void handleDelete()}
      />
    </>
  );
}
