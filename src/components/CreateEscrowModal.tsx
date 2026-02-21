import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Link as LinkIcon, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CreateEscrowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEscrowModal({ open, onOpenChange }: CreateEscrowModalProps) {
  const [step, setStep] = useState<"form" | "loading" | "success">("form");
  const [date, setDate] = useState<Date>();
  const [copied, setCopied] = useState(false);
  const mockLink = "https://trustvault.app/escrow/ESC-0xF3A...7B";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("loading");
    setTimeout(() => setStep("success"), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mockLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setTimeout(() => {
        setStep("form");
        setDate(undefined);
        setCopied(false);
      }, 200);
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "success" ? "Escrow Created!" : "Create New Escrow"}
          </DialogTitle>
        </DialogHeader>

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project Name</Label>
              <Input id="project" placeholder="e.g. Website Redesign" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USDC)</Label>
              <div className="relative">
                <Input id="amount" type="number" placeholder="0.00" min="1" step="0.01" required className="pr-16" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">USDC</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    disabled={(d) => d < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" placeholder="Describe the scope of work..." rows={3} required />
            </div>
            <Button type="submit" className="w-full gap-2">
              Lock Funds & Generate Link
            </Button>
          </form>
        )}

        {step === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Locking funds on-chain...</p>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3">
              <LinkIcon className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate font-mono text-xs">{mockLink}</span>
              <Button variant="ghost" size="sm" className="ml-auto shrink-0" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Share this link with your counterparty to begin the escrow.</p>
            <Button variant="secondary" className="w-full" onClick={() => handleClose(false)}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
