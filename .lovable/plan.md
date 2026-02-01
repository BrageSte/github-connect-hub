
# Plan: Forbedre målehjelp-popup med bedre instruksjoner

## Oversikt
Oppdatere `MeasureHelpModal` med tydeligere, mer praktiske instruksjoner som inkluderer tips før måling, detaljerte steg-for-steg forklaringer, og en ny seksjon om dybde.

## Endringer

### 1. Ny struktur for modalen

**Før** (nåværende):
- Steg 1: Fingerbredde (kort beskrivelse)
- Steg 2: Høydeforskjell (kort beskrivelse)
- Illustrasjon
- Legend (A, B, C)
- Tips-boks

**Etter** (ny):
- 💡 Tips før du måler (LES DETTE FØRST) - ny fremhevet seksjon øverst
- 1) Fingerbredde - utvidet med +2mm margin-tips og eksempel
- 2) Høydeforskjell - utvidet med "trappetrinn"-forklaring
- Illustrasjon (beholdes)
- Legend (beholdes)
- 3) Dybde - NY seksjon med forklaring på 15/20/25mm

### 2. Visuelle forbedringer

| Element | Forbedring |
|---------|------------|
| Tips-seksjon | Flyttes til toppen med sterkere visuell vekt (gul/oransje bakgrunn) |
| Eksempel-boks | Ny komponent for "18 mm målt → skriv inn 20 mm" |
| Dybde-seksjon | Visuell skala med 15/20/25mm og beskrivelser |
| Ikoner | Legge til relevante Lucide-ikoner (Ruler, ArrowUp, Layers) |

### 3. Ny visuell komponent: DybdeGuide

Lage en enkel SVG eller komponent som viser de tre dybdealternativene visuelt:

```text
┌─────────────────────────────────────────┐
│  15mm        20mm         25mm          │
│  ████        ██████       ██████████    │
│  Strengt     Allround     Snill         │
└─────────────────────────────────────────┘
```

## Filer som endres

| Fil | Endring |
|-----|---------|
| `src/components/configurator/MeasureHelpModal.tsx` | Oppdatere innhold med nye instruksjoner, ny struktur, og visuelle elementer |
| `src/components/configurator/DepthGuide.tsx` | **Ny fil** - Visuell komponent for dybdeforklaring |

## Tekniske detaljer

### MeasureHelpModal.tsx - Ny struktur

```tsx
// Imports legger til Lucide-ikoner
import { Lightbulb, Ruler, ArrowUpDown, Layers } from 'lucide-react'
import DepthGuide from './DepthGuide'

// Ny seksjon-struktur:
// 1. Tips før du måler (fremhevet boks med gul/oransje bakgrunn)
// 2. Fingerbredde med eksempel
// 3. Høydeforskjell med trappetrinn-forklaring
// 4. MeasureGuide illustrasjon (beholdes)
// 5. Legend (beholdes)
// 6. Dybde med DepthGuide komponent
```

### DepthGuide.tsx - Ny komponent

```tsx
// SVG som viser tre rektangler med økende dybde
// 15mm - "Grunn kant" - Strengere/hardere
// 20mm - "Midt" - Allround (anbefalt)
// 25mm - "Dyp kant" - Snillere/bedre grep
```

### Innholdsoversikt

**Tips før du måler:**
- Bruk skyvelære for best presisjon
- Klem fingeren lett ned mot en kant når du måler
- Litt ekstra margin er bedre enn for tight

**Fingerbredde:**
- Mål bredden ytterst på fingerputen
- Legg til 2 mm totalt (1 mm på hver side)
- Eksempel: 18 mm målt → skriv inn 20 mm

**Høydeforskjell:**
- Lillefinger er alltid utgangspunktet
- "Trappetrinn"-forklaring
- A: Lille → Ring
- B: Ring → Lang
- C: Lang → Peke

**Dybde:**
- 25 mm = dyp kant, mer hud, snillere
- 20 mm = allround (anbefalt hvis usikker)
- 15 mm = grunn kant, mindre hud, strengere
