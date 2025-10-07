import { SiteHeader } from "@/components/site-header";

export function PromotionsPage() {
    return (
        <div className="min-h-screen">
              <SiteHeader />
              <main className="flex-1">
                <div className="space-y-6 p-6">
                  <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <h1 className="text-2xl font-bold mb-4">Promotions Page</h1>
                    <p>Welcome to your business dashboard!</p>
                  </div>
                </div>
              </main>
            </div>
    );
}