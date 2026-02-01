
# Plan: 3D STL-visning med blokktype-valg

## Oversikt

Legger til interaktiv 3D-visning av de to blokkvariantene (shortedge og longedge) i konfiguratoren, med prisforskjell og produktvalg.

## Hva jeg vil gjøre

### 1. Kopiere STL-filer til prosjektet
Plasserer begge STL-filene i `public/models/`:
- `public/models/blokk_shortedge.stl` (kompakt variant)
- `public/models/blokk_longedge.stl` (lang kant variant)

### 2. Installere 3D-biblioteker
Legger til følgende pakker:
- `three` - 3D rendering engine
- `@react-three/fiber@^8.18` - React wrapper for Three.js
- `@react-three/drei@^9.122.0` - Hjelpeverktøy og komponenter

### 3. Opprette 3D STL-visningskomponent
Ny fil: `src/components/configurator/StlViewer.tsx`
- Laster inn STL-filer dynamisk basert på valgt blokktype
- Interaktiv rotasjon med mus/touch
- Profesjonell belysning
- Loading-indikator mens modellen lastes

### 4. Legge til blokktype-valg i konfiguratoren
Oppdaterer `CrimpConfigurator.tsx` med:
- Nytt state for valgt blokktype (`shortedge` | `longedge`)
- Visuelt valg mellom de to variantene med prisvisning:
  - **Short Edge**: 449 kr - kompakt og portabel
  - **Long Edge**: 549 kr - ekstra flate for stabilitet
- Erstatter SVG-preview med 3D-visning
- Oppdaterer prislogikk basert på valg

### 5. Oppdatere bestillingsmodal
Endrer `OrderModal.tsx` til:
- Vise valgt blokktype i bestillingen
- Korrekt pris basert på shortedge (449) eller longedge (549)
- Inkludere blokktype i e-post-ordren

## Brukerflyt

```text
┌─────────────────────────────────────────────────────────┐
│  KONFIGURATOR                                           │
├─────────────────────────────────────────────────────────┤
│  1. Velg blokktype                                      │
│     ┌─────────────────┐  ┌─────────────────┐            │
│     │   SHORT EDGE    │  │   LONG EDGE     │            │
│     │     449,-       │  │     549,-       │            │
│     │   (kompakt)     │  │   (ekstra flate)│            │
│     └─────────────────┘  └─────────────────┘            │
│                                                         │
│  2. 3D Forhåndsvisning                                  │
│     ┌─────────────────────────────────────────┐         │
│     │                                         │         │
│     │    [Interaktiv 3D-modell av valgt       │         │
│     │     blokktype - kan roteres med mus]    │         │
│     │                                         │         │
│     └─────────────────────────────────────────┘         │
│                                                         │
│  3. Konfigurer fingermål (eksisterende)                 │
│     ...                                                 │
│                                                         │
│  4. Bestill                                             │
│     [Bestill - pris vises basert på valgt blokk]        │
└─────────────────────────────────────────────────────────┘
```

## Prisstruktur

| Variant | Pris | Beskrivelse |
|---------|------|-------------|
| Short Edge | 449 kr | Kompakt blokk, lett å ta med |
| Long Edge | 549 kr | Lang kant gir ekstra flate og stabilitet |

## Tekniske detaljer

**STL Loader oppsett:**
```typescript
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

// Loader hook som bruker STLLoader til å parse filen
// og returnerer geometri som kan brukes i mesh
```

**3D Scene oppsett:**
- OrbitControls for rotasjon/zoom
- Ambient + directional lighting
- MeshStandardMaterial med metallisk finish
- Responsiv canvas som fyller container

## Filer som endres

| Fil | Endring |
|-----|---------|
| `public/models/blokk_shortedge.stl` | Ny fil (kopi) |
| `public/models/blokk_longedge.stl` | Ny fil (kopi) |
| `src/components/configurator/StlViewer.tsx` | Ny komponent |
| `src/components/configurator/CrimpConfigurator.tsx` | Legger til blokkvalg + 3D |
| `src/components/configurator/OrderModal.tsx` | Oppdatert pris/info |
| `src/types/index.ts` | Ny type for blokkvariant |
