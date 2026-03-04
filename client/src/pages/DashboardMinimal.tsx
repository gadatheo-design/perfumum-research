// @ts-nocheck
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function DashboardMinimal() {
  return (
    <div className="container py-8">
      <Breadcrumbs />
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>✅ Dashboard Minimal</h1>
      <p>Si vous voyez ce texte, le problème vient des appels tRPC.</p>
    </div>
  );
}
