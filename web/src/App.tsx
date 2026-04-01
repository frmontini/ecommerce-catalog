import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { ToastProvider } from "@/contexts/toast-context";
import { AppShell } from "@/components/layout/app-shell";
import HomePage from "@/pages/home";
import ProductDetailsPage from "@/pages/product-details";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import AdminProductFormPage from "@/pages/admin-product-form";
import AdminCategoriesPage from "@/pages/admin-categories";
import { ProtectedRoute } from "@/routes/protected-route";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppShell>
          <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<ProductDetailsPage />} path="/products/:id" />
            <Route element={<LoginPage />} path="/login" />
            <Route element={<RegisterPage />} path="/register" />

            <Route element={<ProtectedRoute />}>
              <Route element={<AdminProductFormPage />} path="/admin/products/new" />
              <Route element={<AdminProductFormPage />} path="/admin/products/:id/edit" />
              <Route element={<AdminCategoriesPage />} path="/admin/categories" />
            </Route>
          </Routes>
        </AppShell>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
