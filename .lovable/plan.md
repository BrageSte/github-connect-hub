
# Plan: Forbedre synlighet på tall-inputs i "Dine mål"

## Problem
De nåværende input-feltene for fingerbredde og høydeforskjell bruker standard HTML number-inputs. Nettleserens innebygde piler er små, vanskelige å se, og passer dårlig med det mørke designet.

## Løsning
Lage en ny gjenbrukbar `NumberStepper`-komponent med store, tydelige +/- knapper som er enkle å bruke på både desktop og mobil.

## Visuelt eksempel

```text
┌─────────────────────────────────┐
│  ─    │      21      │    +    │
│  ▼    │              │    ▲    │
└─────────────────────────────────┘
```

Knappene vil være:
- Store nok til å trykke enkelt (44x44px touchmål)
- Tydelig synlige med kontrast mot bakgrunnen
- Animerte ved hover/klikk
- Støtte for hold-for-rask-endring

## Filer som endres

| Fil | Endring |
|-----|---------|
| `src/components/ui/number-stepper.tsx` | **Ny fil** - Gjenbrukbar komponent med +/- knapper |
| `src/components/configurator/CrimpConfigurator.tsx` | Erstatte `<input type="number">` med `NumberStepper` |

## Tekniske detaljer

### NumberStepper-komponent
```typescript
interface NumberStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  size?: 'sm' | 'md' // sm for fingerbredde, md for høydeforskjell
}
```

### Design-spesifikasjoner
- **Knapper**: Runde eller avrundede rektangler med `ChevronUp`/`ChevronDown` eller `Plus`/`Minus` ikoner fra Lucide
- **Farge**: Primærfarge på hover, subtil bakgrunn i normalstatus
- **Størrelse (sm)**: For fingerbredde-inputs i 4-kolonne grid
- **Størrelse (md)**: For høydeforskjell-inputs med mer plass
- **Tilgjengelighet**: Tastaturnavigasjon med piltaster

### Endringer i CrimpConfigurator
- Fingerbredde (linje 199-206): Byttes til `NumberStepper` med `size="sm"`
- Høydeforskjell (linje 222-254): Byttes til `NumberStepper` med `size="md"`
