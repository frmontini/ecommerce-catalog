import type { PropsWithChildren } from "react";
import { AppHeader } from "./app-header";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <AppHeader />
      <main className="container-page py-8">{children}</main>
    </div>
  );
}
