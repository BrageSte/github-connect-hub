
# Plan: Nettbutikk med handlekurv og mock Stripe

## Oversikt

Omgjør BS Climbing til en komplett nettbutikk med handlekurv, checkout-flyt og dummy Stripe-integrasjon. Backend (Edge Functions, database, webhooks) implementeres senere.

## Arkitektur

```text
src/
├── contexts/
│   └── CartContext.tsx          # Global cart state + localStorage
├── types/
│   └── shop.ts                  # Product, CartItem, Order types
├── components/
│   ├── cart/
│   │   ├── CartDrawer.tsx       # Slide-over handlekurv
│   │   ├── CartItem.tsx         # Enkelt produkt i kurv
│   │   └── CartSummary.tsx      # Subtotal, frakt, total
│   └── Header.tsx               # Oppdatert med cart-ikon + badge
├── pages/
│   ├── Cart.tsx                 # Full-page cart (fallback)
│   ├── Checkout.tsx             # Mock checkout
│   ├── CheckoutSuccess.tsx      # "Takk for bestilling"
│   ├── CheckoutCancel.tsx       # "Avbrutt"
│   ├── Shipping.tsx             # Frakt-info
│   ├── Returns.tsx              # Retur-policy
│   ├── Privacy.tsx              # Personvern
│   └── Contact.tsx              # Kontakt
└── lib/
    └── stripe-mock.ts           # Mock Stripe checkout
```

## Del 1: Types og datamodeller

### Nye typer i `src/types/shop.ts`

| Type | Beskrivelse |
|------|-------------|
| `Product` | id, name, price, description, variant, image |
| `CartItem` | product + quantity |
| `Order` | orderId, items, total, email, timestamp, status |
| `ShippingInfo` | Fraktkostnad (79 kr fast) |

## Del 2: Cart Context

### `CartContext.tsx`
- Global state for handlekurv
- Funksjoner: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
- Kalkulerer: subtotal, shipping (79 kr), total
- Persister til localStorage ved hver endring
- Laster fra localStorage ved app-start

## Del 3: UI-komponenter

### Header oppdatering
- Legg til handlekurv-ikon med badge (antall varer)
- Klikk åpner CartDrawer

### CartDrawer
- Slide-over fra høyre (Sheet-komponent)
- Viser alle varer med bilde, navn, pris
- +/- knapper for å endre antall
- Fjern-knapp per vare
- Subtotal, fraktlinje (79 kr), total
- "Gå til kassen" knapp
- "Fortsett å handle" lenke

### CartItem komponent
- Produktbilde, navn, variant
- Pris per stk
- Quantity selector
- Fjern-knapp
- Linjepris

## Del 4: Produktintegrasjon

### Konfiguratorens "Legg i handlekurv"
- Erstatter mailto-flyten med `addToCart()`
- Produktdata: blokktype, mål, pris
- Genererer unik produkt-ID basert på konfigurasjon
- Toast-melding: "Lagt til i handlekurven"

## Del 5: Checkout-flyt (mock)

### Checkout-side
- Viser ordresammendrag
- E-post input (for ordre)
- "Betal med Vipps (via Stripe)" - primær CTA
- "Betal med kort" - sekundær
- Ved klikk: simulerer redirect til Stripe (2 sek delay), deretter success

### Mock Stripe-funksjon
```typescript
// Simulerer Stripe Checkout Session
async function createMockCheckoutSession(items: CartItem[]) {
  // Returnerer mock session URL
  return { url: '/checkout/success?mock=true' }
}
```

### Success-side (`/checkout/success`)
- "Takk for bestillingen!"
- Ordresammendrag (lagret i sessionStorage)
- Ordrenummer (generert)
- Tømmer handlekurven
- "Fortsett å handle" knapp

### Cancel-side (`/checkout/cancel`)
- "Betalingen ble avbrutt"
- Handlekurven er fortsatt intakt
- "Tilbake til handlekurven" knapp

## Del 6: Info-sider

### Nye sider
| Side | Innhold |
|------|---------|
| `/shipping` | Fast frakt 79 kr, leveringstid 3-5 dager |
| `/returns` | 14 dagers åpent kjøp, returadresse |
| `/privacy` | Personvernerklæring |
| `/contact` | Kontaktinfo, e-post |

### Footer oppdatering
- Lenker til alle info-sider
- Organisert i kolonner

## Del 7: Feilhåndtering

- Tom handlekurv: "Handlekurven din er tom" + CTA
- Nettverksfeil: Toast med retry
- Stripe-feil: Redirect til cancel-side med feilmelding

## Teknisk implementering

### Fil-liste

| Fil | Handling |
|-----|----------|
| `src/types/shop.ts` | **Ny** |
| `src/contexts/CartContext.tsx` | **Ny** |
| `src/components/cart/CartDrawer.tsx` | **Ny** |
| `src/components/cart/CartItem.tsx` | **Ny** |
| `src/components/cart/CartSummary.tsx` | **Ny** |
| `src/pages/Cart.tsx` | **Ny** |
| `src/pages/Checkout.tsx` | **Ny** |
| `src/pages/CheckoutSuccess.tsx` | **Ny** |
| `src/pages/CheckoutCancel.tsx` | **Ny** |
| `src/pages/Shipping.tsx` | **Ny** |
| `src/pages/Returns.tsx` | **Ny** |
| `src/pages/Privacy.tsx` | **Ny** |
| `src/pages/Contact.tsx` | **Ny** |
| `src/lib/stripe-mock.ts` | **Ny** |
| `src/components/Header.tsx` | **Endres** - Cart-ikon |
| `src/components/Footer.tsx` | **Endres** - Lenker |
| `src/components/configurator/CrimpConfigurator.tsx` | **Endres** - addToCart |
| `src/App.tsx` | **Endres** - Routes + CartProvider |

### localStorage nøkkel
- `bs-climbing-cart`: JSON array med CartItem[]

### Senere (backend)
- Supabase Edge Function: `/api/create-checkout-session`
- Stripe webhook: `/api/stripe-webhook`
- Supabase tabell: `orders`
- Resend integrasjon for e-post
