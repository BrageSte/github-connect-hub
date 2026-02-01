

# Plan: Forbedret konfigurator med dobbel 3D-visning og hjelpeguide

## Oversikt

Denne planen legger til en dynamisk 3D-visualisering av fingermålene, beholder STL-visningen for blokkvalg, fjerner "Mål mellom leddene"-seksjonen og erstatter den med en utvidbar hjelpeguide.

## Endringer

### 1. Fjerne MeasureGuide-seksjonen
Fjerner hele kortet "Mål mellom leddene" fra venstre kolonne.

### 2. Legge til hjelpeguide-lenke
Legger til en klikkbar lenke/knapp under høydeforskjell-seksjonen:
- Tekst: "Problemer med å måle fingrene? Trykk her så hjelper vi deg"
- Åpner en modal eller collapsible seksjon med steg-for-steg guide
- Inkluderer MeasureGuide SVG-illustrasjonen

### 3. Opprette ny DynamicBlockPreview-komponent
En 3D-komponent som visualiserer de faktiske fingermålene i sanntid:
- Viser 4 fingerspor med riktig bredde og høyde basert på input
- Oppdateres live når brukeren endrer verdier
- Lignende stil som bs-climbing-flat sin Preview3D
- Viser dimensjoner på hver finger-blokk

### 4. Oppdatere konfigurator-layout
Ny struktur:
```text
VENSTRE KOLONNE:
├── Velg blokktype (shortedge/longedge)
├── 3D Forhåndsvisning (STL av valgt variant)
└── Dine mål (dynamisk 3D med fingermål)

HØYRE KOLONNE:
├── Fingerbredde (mm)
├── Høydeforskjell (mm)
│   └── "Trenger du hjelp?" (klikkbar)
├── Dybde
├── Bestill
└── Sammendrag
```

## Teknisk implementering

### Ny komponent: DynamicBlockPreview.tsx
```typescript
// Tar imot widths, calculatedHeights, depth
// Genererer 4 3D-bokser som representerer fingrene
// Bruker Three.js boxGeometry med dynamiske dimensjoner
// Live-oppdatering når props endres
```

### Ny komponent: MeasureHelpModal.tsx
```typescript
// Modal/dialog som åpnes når bruker trenger hjelp
// Inneholder steg-for-steg guide med illustrasjoner
// Bruker eksisterende MeasureGuide SVG
```

### Endringer i CrimpConfigurator.tsx
- Fjerner import av MeasureGuide
- Legger til import av DynamicBlockPreview
- Legger til import av MeasureHelpModal
- Legger til state for modal-visning
- Oppdaterer layout for å vise begge 3D-visninger

## Brukeropplevelse

1. **Velg blokktype** - Bruker ser STL-modell av short/long edge
2. **Se dine mål** - Bruker ser en dynamisk 3D-modell som viser de faktiske dimensjonene de har valgt
3. **Juster verdier** - Høyre kolonne med inputs oppdaterer 3D-visningen i sanntid
4. **Trenger hjelp?** - Diskret lenke åpner detaljert måleveiledning

## Filer som endres/opprettes

| Fil | Handling |
|-----|----------|
| `src/components/configurator/DynamicBlockPreview.tsx` | **Ny** - 3D-visning av fingermål |
| `src/components/configurator/MeasureHelpModal.tsx` | **Ny** - Hjelpeguide modal |
| `src/components/configurator/CrimpConfigurator.tsx` | **Endres** - Ny layout |
| `src/components/configurator/MeasureGuide.tsx` | **Beholdes** - Brukes i modal |

