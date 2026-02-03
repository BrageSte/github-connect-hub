import { useState, useMemo } from "react";
import OrderModal from "./OrderModal";
import StlViewer, { type BlockVariant } from "./StlViewer";
import BlockSelector, { BLOCK_OPTIONS } from "./BlockSelector";
import DynamicBlockPreview from "./DynamicBlockPreview";
import MeasureHelpModal from "./MeasureHelpModal";
import { HelpCircle, ShoppingBag, Download } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Product, generateProductId, BlockConfig } from "@/types/shop";
import { useToast } from "@/hooks/use-toast";
import { NumberStepper } from "@/components/ui/number-stepper";

const FINGER_NAMES = ["lillefinger", "ringfinger", "langfinger", "pekefinger"] as const;
type FingerName = (typeof FINGER_NAMES)[number];

interface Widths {
  lillefinger: number;
  ringfinger: number;
  langfinger: number;
  pekefinger: number;
}

interface HeightDiffs {
  lilleToRing: number;
  ringToLang: number;
  langToPeke: number;
}

export default function CrimpConfigurator() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [blockVariant, setBlockVariant] = useState<BlockVariant>("shortedge");

  const [widths, setWidths] = useState<Widths>({
    lillefinger: 21,
    ringfinger: 20,
    langfinger: 20,
    pekefinger: 22,
  });

  const [heightDiffs, setHeightDiffs] = useState<HeightDiffs>({
    lilleToRing: 5,
    ringToLang: 5,
    langToPeke: 3,
  });

  const lilleHeight = 10;

  const calculatedHeights = useMemo(() => {
    const ring = lilleHeight + heightDiffs.lilleToRing;
    const lang = ring + heightDiffs.ringToLang;
    const peke = lang - heightDiffs.langToPeke;
    return {
      lillefinger: lilleHeight,
      ringfinger: ring,
      langfinger: lang,
      pekefinger: peke,
    };
  }, [heightDiffs]);

  const [depth, setDepth] = useState(20);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderType, setOrderType] = useState<"file" | "printed" | null>(null);
  const [orderSent, setOrderSent] = useState(false);
  const [showMeasureHelp, setShowMeasureHelp] = useState(false);

  const totalWidth = useMemo(() => {
    const fingerWidths = Object.values(widths).reduce((sum, w) => sum + w, 0);
    return fingerWidths + 16;
  }, [widths]);

  const currentPrice = BLOCK_OPTIONS.find((o) => o.variant === blockVariant)?.price ?? 449;
  const filePrice = 199;

  const createBlockConfig = (): BlockConfig => ({
    blockVariant,
    widths,
    heights: calculatedHeights,
    depth,
    totalWidth,
  });

  const handleAddToCart = (type: "file" | "printed") => {
    const config = createBlockConfig();
    const productId = generateProductId(config, type);

    const product: Product = {
      id: productId,
      name:
        type === "file"
          ? `Stepper STL-fil (${blockVariant === "shortedge" ? "Short Edge" : "Long Edge"})`
          : `Stepper ${blockVariant === "shortedge" ? "Short Edge" : "Long Edge"}`,
      description: `Tilpasset crimp block: ${totalWidth.toFixed(1)}mm bred × ${depth}mm dyp`,
      price: type === "file" ? filePrice : currentPrice,
      variant: blockVariant === "shortedge" ? "Short Edge" : "Long Edge",
      isDigital: type === "file",
      config,
    };

    addToCart(product, 1);

    toast({
      title: "Lagt i handlekurven!",
      description: product.name,
    });
  };

  const generateOrder = (type: "file" | "printed") => {
    setOrderType(type);
    setShowOrderForm(true);
  };

  const handleOrderComplete = () => {
    setOrderSent(true);
    setShowOrderForm(false);
  };

  const handleReset = () => {
    setOrderSent(false);
    setShowOrderForm(false);
  };

  if (orderSent) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-valid/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-valid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Bestilling sendt!</h2>
          <p className="text-muted-foreground mb-6">Send e-posten for å fullføre bestillingen.</p>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-hover transition-colors"
          >
            Ny konfigurasjon
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* STEP 1: Velg produkt */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
            1
          </span>
          <h2 className="text-lg font-semibold text-foreground">Velg produkt</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Block type selector */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Blokktype</h3>
            <BlockSelector selected={blockVariant} onChange={setBlockVariant} />
          </div>

          {/* 3D Preview - STL Model */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
              3D Forhåndsvisning
            </h3>
            <StlViewer variant={blockVariant} />
          </div>
        </div>
      </section>

      {/* STEP 2: Dine mål */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
            2
          </span>
          <h2 className="text-lg font-semibold text-foreground">Dine mål</h2>
          <button
            onClick={() => setShowMeasureHelp(true)}
            className="ml-auto flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Trenger du hjelp?
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Inputs */}
          <div className="space-y-6">
            {/* Finger widths */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                Fingerbredde (mm)
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Mål ytterst på fingerpaden. Legg til 1 mm på hver side (2 mm totalt) for komfort. Pro-tip: Klem på en
                vanlig crimpkant og se hvor bredt padden “sprer seg”.
              </p>
              <div className="grid grid-cols-4 gap-3">
                {(["Lille", "Ring", "Lang", "Peke"] as const).map((label, i) => {
                  const finger = FINGER_NAMES[i];
                  return (
                    <div key={finger} className="text-center">
                      <label className="text-xs text-muted-foreground block mb-2">{label}</label>
                      <NumberStepper
                        value={widths[finger]}
                        onChange={(val) => setWidths((prev) => ({ ...prev, [finger]: val }))}
                        min={15}
                        max={30}
                        size="sm"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Height differences */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                Høydeforskjell (mm)
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Dette er “unlevel”. Vi justerer stegene slik at alle fire fingre jobber mer likt i halvcrimp. Usikker?
                La standard stå.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 bg-blue-600 rounded-lg text-white text-xs flex items-center justify-center font-bold shrink-0">
                    A
                  </span>
                  <span className="text-foreground text-sm flex-1">Fra lillefinger → ringfinger</span>
                  <NumberStepper
                    value={heightDiffs.lilleToRing}
                    onChange={(val) => setHeightDiffs((prev) => ({ ...prev, lilleToRing: val }))}
                    min={-15}
                    max={15}
                    size="sm"
                    className="w-28"
                  />
                  <span className="text-muted-foreground text-sm w-16 text-right font-mono">
                    = {calculatedHeights.ringfinger}mm
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 bg-blue-600 rounded-lg text-white text-xs flex items-center justify-center font-bold shrink-0">
                    B
                  </span>
                  <span className="text-foreground text-sm flex-1">Fra ringfinger → langfinger</span>
                  <NumberStepper
                    value={heightDiffs.ringToLang}
                    onChange={(val) => setHeightDiffs((prev) => ({ ...prev, ringToLang: val }))}
                    min={-15}
                    max={15}
                    size="sm"
                    className="w-28"
                  />
                  <span className="text-muted-foreground text-sm w-16 text-right font-mono">
                    = {calculatedHeights.langfinger}mm
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 bg-red-600 rounded-lg text-white text-xs flex items-center justify-center font-bold shrink-0">
                    C
                  </span>
                  <span className="text-foreground text-sm flex-1">Fra langfinger → pekefinger</span>
                  <NumberStepper
                    value={heightDiffs.langToPeke}
                    onChange={(val) => setHeightDiffs((prev) => ({ ...prev, langToPeke: val }))}
                    min={-15}
                    max={15}
                    size="sm"
                    className="w-28"
                  />
                  <span className="text-muted-foreground text-sm w-16 text-right font-mono">
                    = {calculatedHeights.pekefinger}mm
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Lillefinger: fast 10mm (utgangspunkt)</p>
            </div>

            {/* Depth selector */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Dybde</h3>
              <p className="text-xs text-muted-foreground mb-4">
                15 mm = strengere. 20 mm = standard. 25 mm = snillere / mer volum.
              </p>
              <div className="flex gap-3">
                {[15, 20, 25].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDepth(d)}
                    className={`flex-1 py-3 rounded-xl font-mono text-sm font-semibold transition-all ${
                      depth === d
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-light border border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    {d} mm
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Dynamic 3D Preview */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Forhåndsvisning av dine mål
            </h3>
            <DynamicBlockPreview widths={widths} heights={calculatedHeights} depth={depth} />
            <p className="text-xs text-muted-foreground text-center mt-3">
              Roter med musen for å se fra forskjellige vinkler
            </p>
          </div>
        </div>
      </section>

      {/* STEP 3: Bestill */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
            3
          </span>
          <h2 className="text-lg font-semibold text-foreground">Bestill</h2>
        </div>

        {/* Summary */}
        <div className="bg-surface-light rounded-xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block">Blokktype</span>
              <span className="text-foreground font-medium">
                {blockVariant === "shortedge" ? "Short Edge" : "Long Edge"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Dybde</span>
              <span className="text-foreground font-mono font-medium">{depth}mm</span>
            </div>
          </div>
        </div>

        {/* Order buttons */}
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleAddToCart("file")}
            className="p-6 bg-surface-light border border-border rounded-xl transition-all hover:border-primary/50 hover:shadow-glow text-center group"
          >
            <Download className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-foreground font-medium mb-1">Kjøp STL </div>
            <div className="text-xs text-muted-foreground">Leveres på mail etter betaling.</div>
            <div className="text-2xl font-bold text-primary">{filePrice},-</div>
            <p className="text-xs text-muted-foreground mt-2">Inkluderer dine custom mål.</p>
          </button>
          <button
            onClick={() => handleAddToCart("printed")}
            className="p-6 bg-surface-light border border-border rounded-xl transition-all hover:border-valid/50 text-center group"
          >
            <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-valid" />
            <div className="text-foreground font-medium mb-1">Kjøp ferdig printet </div>
            <div className="text-xs text-muted-foreground">Produseres på bestilling – normalt sendt innen 1 uke.</div>
            <div className="text-2xl font-bold text-valid">{currentPrice},-</div>
            <p className="text-xs text-muted-foreground mt-2">Inkluderer dine custom mål.</p>
          </button>
        </div>
      </section>

      {/* Order Modal */}
      {showOrderForm && orderType && (
        <OrderModal
          orderType={orderType}
          blockVariant={blockVariant}
          widths={widths}
          calculatedHeights={calculatedHeights}
          depth={depth}
          totalWidth={totalWidth}
          onClose={() => setShowOrderForm(false)}
          onComplete={handleOrderComplete}
        />
      )}

      {/* Measure Help Modal */}
      <MeasureHelpModal open={showMeasureHelp} onOpenChange={setShowMeasureHelp} />
    </div>
  );
}
