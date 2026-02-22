import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Link as LinkIcon, Copy, Check, Coins, ImagePlus, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Currency } from "@/data/contracts";

interface CreateEscrowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const currencies: { value: Currency; label: string; sub: string }[] = [
  { value: "AUSD", label: "AUSD", sub: "Yield-Bearing" },
  { value: "AVAX", label: "AVAX", sub: "Native" },
  { value: "USDC", label: "USDC", sub: "Stablecoin" },
];

export function CreateEscrowModal({ open, onOpenChange }: CreateEscrowModalProps) {
  const [step, setStep] = useState<"form" | "confirm" | "loading" | "success">("form");
  const [date, setDate] = useState<Date>();
  const [copied, setCopied] = useState(false);
  const [currency, setCurrency] = useState<Currency>("AUSD");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [refImages, setRefImages] = useState<string[]>([]);
  const maxRefImages = 3;
  const mockLink = "https://artguard.avax/escrow/ESC-0xF3A...7B";

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirm");
  };

  const handleConfirmCreate = () => {
    setStep("loading");
    setTimeout(() => setStep("success"), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mockLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addRefImage = () => {
    if (refImages.length < maxRefImages) {
      setRefImages([...refImages, `ref_${refImages.length + 1}.png`]);
    }
  };

  const removeRefImage = (idx: number) => {
    setRefImages(refImages.filter((_, i) => i !== idx));
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setTimeout(() => {
        setStep("form");
        setDate(undefined);
        setCopied(false);
        setCurrency("AUSD");
        setAmount("");
        setTitle("");
        setRefImages([]);
      }, 200);
    }
    onOpenChange(val);
  };

  return (
    <>
      <Dialog open={open && step !== "confirm"} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {step === "success" ? "Escrow Created!" : "Create New Escrow Contract"}
            </DialogTitle>
          </DialogHeader>

          {step === "form" && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project">Title</Label>
                <Input id="project" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Album Cover Art" required />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className={cn("p-3 pointer-events-auto")} disabled={(d) => d < new Date()} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        <span className="flex items-center gap-2">
                          <span className="font-semibold">{c.label}</span>
                          <span className="text-xs text-muted-foreground">({c.sub})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currency === "AUSD" && (
                  <p className="flex items-center gap-1.5 text-xs text-primary">
                    <Coins className="h-3 w-3" /> AUSD funds earn yield while locked in escrow.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100" min="0.01" step="0.01" required className="pr-16" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">{currency}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" placeholder="Describe the scope of work..." rows={3} required />
              </div>
              <div className="space-y-2">
                <Label>Reference Images <span className="text-muted-foreground text-xs">(optional, up to 3)</span></Label>
                <div className="flex gap-2 flex-wrap">
                  {refImages.map((img, i) => (
                    <div key={i} className="relative flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-secondary text-xs font-mono text-muted-foreground">
                      <span className="text-[10px]">{img}</span>
                      <button type="button" onClick={() => removeRefImage(i)} className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  ))}
                  {refImages.length < maxRefImages && (
                    <button type="button" onClick={addRefImage} className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                      <ImagePlus className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full gap-2 glow-primary">
                Lock Funds & Generate Link
              </Button>
            </form>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Locking funds on Avalanche...</p>
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
              <p className="text-sm text-muted-foreground">Share this link with the Artist to begin the escrow.</p>
              <Button variant="secondary" className="w-full" onClick={() => handleClose(false)}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={step === "confirm"} onOpenChange={(v) => { if (!v) setStep("form"); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-display">
              <AlertTriangle className="h-5 w-5 text-warning" /> Confirm Escrow Creation
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to lock <strong>{amount} {currency}</strong> for "<strong>{title}</strong>" in a smart contract.
              This amount will be held in escrow until the commission is completed or disputed. Proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStep("form")}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCreate} className="glow-primary">
              Confirm & Lock Funds
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
