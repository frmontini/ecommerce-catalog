import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createProduct, getProduct, updateProduct } from "@/api/products";
import { getCategories } from "@/api/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/contexts/toast-context";
import type { Category } from "@/types/category";

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400?text=Produto";

type FormValues = {
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string;
};

function formatPriceInput(value: number | string) {
  const numeric = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  const safe = Number.isFinite(numeric) ? numeric : 0;
  return safe.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parsePriceInput(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeMaskedValue(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const numeric = Number(digits || "0") / 100;
  return formatPriceInput(numeric);
}

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [priceInput, setPriceInput] = useState("0,00");

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category_id: 0,
      image_url: PLACEHOLDER_IMAGE,
    },
  });

  const imagePreview = form.watch("image_url");
  const selectedCategory = form.watch("category_id");

  const selectedCategoryName = useMemo(
    () => categories.find((item) => Number(item.id) === Number(selectedCategory))?.name ?? "Selecione uma categoria",
    [categories, selectedCategory],
  );

  useEffect(() => {
    if (!isEdit || !id) {
      void getCategories().then(setCategories).catch(() => undefined);
      return;
    }

    let alive = true;

    Promise.all([getCategories(), getProduct(id)])
      .then(([categoryList, product]) => {
        if (!alive) return;

        setCategories(categoryList);

        if (!product) return;

        const currentCategoryId = Number(product.category_id ?? product.category?.id ?? 0);
        const currentPrice = Number(product.price ?? 0);

        form.reset({
          name: product.name,
          description: product.description,
          price: currentPrice,
          category_id: currentCategoryId,
          image_url: product.image_url || PLACEHOLDER_IMAGE,
        });

        form.setValue("category_id", currentCategoryId, { shouldDirty: false, shouldTouch: false });
        setPriceInput(formatPriceInput(currentPrice));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [form, id, isEdit]);

  async function onSubmit(values: FormValues) {
    try {
      setServerError(null);

      const payload = {
        ...values,
        image_url: values.image_url || PLACEHOLDER_IMAGE,
        price: parsePriceInput(priceInput),
      };

      if (isEdit && id) {
        await updateProduct(Number(id), payload);
        toast({ title: "Produto atualizado", description: "As alterações foram salvas com sucesso.", variant: "success" });
      } else {
        await createProduct(payload);
        toast({ title: "Produto salvo", description: "O novo item já pode aparecer no catálogo.", variant: "success" });
      }

      navigate("/", { replace: true });
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string } | undefined)?.message || "Falha ao salvar o produto."
          : "Falha ao salvar o produto.";
      setServerError(message);
      toast({ title: "Falha ao salvar", description: message, variant: "error" });
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Card className="overflow-hidden border-white/10 bg-slate-900/75 shadow-2xl shadow-black/30">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <CardHeader>
              <CardTitle className="text-2xl text-white">{isEdit ? "Editar produto" : "Novo produto"}</CardTitle>
              <CardDescription className="text-slate-400">
                Preencha os dados do produto para manter a área administrativa pronta para demonstração.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-slate-400">Carregando dados do produto...</p>
              ) : (
                <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                  <div>
                    <Label className="text-slate-200" htmlFor="name">Nome</Label>
                    <Input
                      className="mt-2"
                      id="name"
                      {...form.register("name", {
                        required: "Digite o nome do produto",
                        minLength: { value: 2, message: "Digite o nome do produto" },
                      })}
                    />
                    {form.formState.errors.name ? <p className="mt-1 text-sm text-rose-400">{form.formState.errors.name.message}</p> : null}
                  </div>

                  <div>
                    <Label className="text-slate-200" htmlFor="description">Descrição</Label>
                    <Textarea
                      className="mt-2"
                      id="description"
                      {...form.register("description", {
                        required: "Digite uma descrição melhor",
                        minLength: { value: 10, message: "Digite uma descrição melhor" },
                      })}
                    />
                    {form.formState.errors.description ? (
                      <p className="mt-1 text-sm text-rose-400">{form.formState.errors.description.message}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-slate-200" htmlFor="price">Preço</Label>
                      <input
                        type="hidden"
                        {...form.register("price", {
                          validate: (value) => (Number(value) > 0 ? true : "Informe um preço válido"),
                        })}
                      />
                      <Input
                        className="mt-2"
                        id="price"
                        inputMode="numeric"
                        placeholder="0,00"
                        type="text"
                        value={priceInput}
                        onChange={(event) => {
                          const masked = normalizeMaskedValue(event.target.value);
                          setPriceInput(masked);
                          form.setValue("price", parsePriceInput(masked), { shouldValidate: true, shouldDirty: true });
                        }}
                      />
                      {form.formState.errors.price ? <p className="mt-1 text-sm text-rose-400">{form.formState.errors.price.message}</p> : null}
                    </div>

                    <div>
                      <Label className="text-slate-200" htmlFor="category_id">Categoria</Label>
                      <Controller
                        control={form.control}
                        name="category_id"
                        rules={{ validate: (value) => (Number(value) > 0 ? true : "Selecione uma categoria") }}
                        render={({ field }) => (
                          <Select
                            id="category_id"
                            className="mt-2"
                            value={String(field.value ?? 0)}
                            onChange={(event) => field.onChange(Number(event.target.value))}
                          >
                            <option value="0">Selecione</option>
                            {categories.map((category) => (
                              <option key={category.id} value={String(category.id)}>
                                {category.name}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                      <p className="mt-2 text-xs text-slate-400">Categoria atual: {selectedCategoryName}</p>
                      {form.formState.errors.category_id ? (
                        <p className="mt-1 text-sm text-rose-400">{form.formState.errors.category_id.message}</p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-200" htmlFor="image_url">URL da imagem</Label>
                    <Input
                      className="mt-2"
                      id="image_url"
                      {...form.register("image_url", {
                        required: "Digite uma URL válida para a imagem",
                        pattern: {
                          value: /^https?:\/\/.+/i,
                          message: "Digite uma URL válida para a imagem",
                        },
                      })}
                    />
                    <p className="mt-2 text-xs text-slate-400">Sugestão padrão: {PLACEHOLDER_IMAGE}</p>
                    {form.formState.errors.image_url ? (
                      <p className="mt-1 text-sm text-rose-400">{form.formState.errors.image_url.message}</p>
                    ) : null}
                  </div>

                  {serverError ? <p className="text-sm text-rose-400">{serverError}</p> : null}

                  <div className="flex flex-wrap gap-2">
                    <Button className="bg-slate-100 text-slate-950 hover:bg-white" disabled={form.formState.isSubmitting} type="submit">
                      {form.formState.isSubmitting ? "Salvando..." : "Salvar produto"}
                    </Button>
                    <Link to="/">
                      <Button type="button" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                        Cancelar
                      </Button>
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </div>

          <div className="border-t border-white/10 bg-white/[0.03] p-6 lg:border-l lg:border-t-0">
            <p className="mb-3 text-sm font-medium text-slate-200">Prévia</p>
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 shadow-xl shadow-black/20">
              <div className="aspect-[4/3] overflow-hidden bg-slate-950">
                <img
                  src={imagePreview || PLACEHOLDER_IMAGE}
                  alt="Prévia do produto"
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>
              <div className="space-y-2 p-5">
                <p className="text-sm text-slate-400">{selectedCategoryName}</p>
                <h3 className="text-lg font-semibold text-white">{form.watch("name") || "Nome do produto"}</h3>
                <p className="text-sm leading-6 text-slate-300">{form.watch("description") || "Descrição do produto para pré-visualização."}</p>
                <p className="text-base font-semibold text-emerald-300">{priceInput}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
