

# Plan: Fiks leveringsmetode-bug og vurdering av Shopify vs Stripe

## Bugganalyse

### Identifisert Problem
Leveringsmetoden oppdateres korrekt i CartContext, men problemet er at **koden fungerer som forventet**. Etter gjennomgang av koden ser jeg at:

1. `Checkout.tsx` linje 47: `needsShippingAddress = deliveryMethod === 'shipping' && !isDigitalOnly`
2. `setDeliveryMethod` kalles korrekt når bruker klikker på pickup-alternativer (linje 358)
3. `CartContext` oppdaterer `shipping` basert på `getShippingCost(items, deliveryMethod)`

**Den faktiske buggen** kan være én av to ting:
- State-synkronisering mellom test og UI
- Eller en race condition ved første rendering

La meg bekrefte ved å teste flyten i nettleseren med browser-verktøyet etter implementasjon.

---

## Shopify vs Stripe: Vurdering

| Aspekt | Stripe | Shopify |
|--------|--------|---------|
| **Produkt-type** | Betalingsløsning | Full e-commerce plattform |
| **Kostnad** | ~2.9% + transaksjonsgebyr | Fra $29/mnd + avgifter |
| **Vipps-støtte** | Via Stripe (god) | Ikke innebygd |
| **Ordrehåndtering** | Må bygges selv (gjort) | Innebygd dashboard |
| **Kompleksitet** | Lav – allerede integrert | Høy – krever migrasjon |
| **Fysiske produkter** | Fungerer | Optimalisert for dette |

### Anbefaling: **Behold Stripe**

Grunner:
1. **Allerede implementert** – Stripe-integrasjonen er nesten ferdig med mock-checkout
2. **Vipps er prioritet** – Stripe støtter Vipps direkte, Shopify gjør ikke det uten tredjepartsapper
3. **Custom konfigurator** – BSClimbing selger *skreddersydde* produkter, ikke standard katalog
4. **Enklere arkitektur** – Du har allerede ordrehåndtering i Supabase/admin dashboard
5. **Kostnad** – Unngår Shopify-abonnement for en nisje-butikk

Shopify passer bedre for tradisjonelle nettbutikker med produktkatalog, lagerstyring og mange varianter. For BSClimbing med én type produkt (custom crimp blocks) er Stripe + egenbygd løsning mer passende.

---

## Løsning: Verifisere og fikse leveringsmetode-logikk

### Steg 1: Legge til debugging for å verifisere state-flyt

Midlertidig legge til console.log i Checkout.tsx for å spore `deliveryMethod` og `needsShippingAddress` når bruker klikker.

### Steg 2: Potensielle fikser (basert på feilsøking)

Hvis buggen er reell, kan det skyldes:

**A) Initial state ikke synkronisert fra CartContext**
```typescript
// Checkout.tsx - Bruk useEffect for å synkronisere initial state
useEffect(() => {
  console.log('deliveryMethod changed:', deliveryMethod)
  console.log('needsShippingAddress:', needsShippingAddress)
}, [deliveryMethod, needsShippingAddress])
```

**B) CartContext ikke korrekt wrapped**
Sjekke at CartProvider wrapper hele appen i App.tsx.

### Steg 3: Test flyten ende-til-ende

1. Konfigurer et produkt
2. Legg i handlekurv
3. Gå til checkout
4. Velg "Gneis Lilleaker" som hentested
5. Verifiser at adressefeltene forsvinner
6. Legg inn TESTMEG-kode
7. Fullfør bestilling
8. Sjekk at ordren lagres i database

---

## Filer som endres

| Fil | Endring |
|-----|---------|
| `src/pages/Checkout.tsx` | Legge til debug-logging (midlertidig) |
| Test med browser-verktøy | Verifisere at state oppdateres korrekt |

---

## Tekniske detaljer

### Eksisterende kode som håndterer leveringsmetode:

```typescript
// CartContext.tsx - linje 78-81
const shipping = useMemo(() => {
  if (items.length === 0) return 0
  return getShippingCost(items, deliveryMethod)
}, [items, deliveryMethod])

// types/shop.ts - linje 94-101
export function getShippingCost(items: CartItem[], deliveryMethod: DeliveryMethod): number {
  if (isDigitalOnlyCart(items)) return 0
  if (deliveryMethod === 'pickup-gneis' || deliveryMethod === 'pickup-oslo') return 0
  return SHIPPING_COST
}
```

Koden ser teknisk korrekt ut. Problemet kan være at testing ble gjort med ugyldig state, eller at adressefeltene ble fylt ut før bruker byttet til pickup.

---

## Neste steg etter godkjenning

1. Implementere debugging i Checkout.tsx
2. Bruke browser-verktøyet for å teste flyten steg-for-steg
3. Identifisere eksakt hvor state-synkroniseringen feiler
4. Fikse buggen basert på funn
5. Re-teste med TESTMEG-koden
6. Verifisere ordre i database og e-post

