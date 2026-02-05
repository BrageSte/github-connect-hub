import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface HeightValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heightDiffName: string;
  value: number;
  onConfirm: () => void;
}

export default function HeightValidationDialog({
  open,
  onOpenChange,
  heightDiffName,
  value,
  onConfirm
}: HeightValidationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <DialogTitle>Usedvanlig høy verdi</DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed pt-2">
            Du har angitt <span className="font-semibold text-foreground">{value > 0 ? '+' : ''}{value}mm</span> for {heightDiffName}.
            <br /><br />
            <span className="text-foreground font-medium">Er du sikker på at du har målt riktig?</span>
            <br /><br />
            Typiske verdier er mellom -30mm og +30mm. Verdier utenfor dette området er uvanlige og kan tyde på feilmåling.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:border-primary/50 transition-colors"
          >
            Gå tilbake og endre
          </button>
          <button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ja, dette er riktig
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
