import { Navbar } from "@/components/Navbar";
import { Gavel } from "lucide-react";

export default function Court() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container flex flex-col items-center justify-center py-24">
        <Gavel className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold">Court</h1>
        <p className="mt-2 text-muted-foreground">Dispute resolution is coming soon.</p>
      </main>
    </div>
  );
}
