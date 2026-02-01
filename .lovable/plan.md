
# Plan: Promokode + Komplett bestillingsskjema + Navigasjonsfiks

## Oversikt
Denne planen legger til promokode-funksjonalitet i utsjekken, utvider bestillingsskjemaet med fullstendige kundedetaljer og leveringsadresse, og fikser navigasjonslenker som ikke fungerer på andre sider enn forsiden.

---

## Del 1: Navigasjonsfiks i Header

### Problem
"Hvordan" og "FAQ" knappene bruker `scrollToSection()` som kun fungerer på forsiden. Når brukeren er på `/configure` eller `/checkout` finnes ikke disse seksjonene på siden.

### Løsning
Endre fra `scrollToSection()` til vanlige lenker med hash (`/#how-it-works` og `/#faq`). React Router vil navigere til forsiden, og nettleseren vil automatisk scrolle til riktig seksjon.

**Fil:** `src/components/Header.tsx`

Endringer:
- Erstatte `<button onClick={() => scrollToSection('how-it-works')}>` med `<Link to="/#how-it-works">`
- Erstatte `<button onClick={() => scrollToSection('faq')}>` med `<Link to="/#faq">`
- Gjøre samme endring for mobilmenyen

---

## Del 2: Promokode-funksjonalitet

### Nye typer
**Fil:** `src/types/shop.ts`

```
ShippingAddress {
  line1: string
  line2?: string
  postalCode: string
  city: string
}
```

Utvide Order-interface med:
- `customerName: string`
- `customerPhone?: string`
- `shippingAddress?: ShippingAddress`
- `promoCode?: string`

### CartContext utvidelser
**Fil:** `src/contexts/CartContext.tsx`

Legge til:
- `promoCode` state og `setPromoCode` funksjon
- `applyPromoCode(code: string)` - validerer og setter aktiv kode
- `promoDiscount` - beregnet rabattbeløp
- `discountedTotal` - total etter rabatt
- `clearPromoCode()` - nullstill promokode

Gyldige promokoder (hardkodet for testing):
- `TESTMEG` = 100% rabatt

---

## Del 3: Utvidet Checkout-skjema

**Fil:** `src/pages/Checkout.tsx`

### Nye felter i skjemaet

**Kontaktinfo-seksjon:**
- Navn (påkrevd)
- Telefon (valgfritt)  
- E-post (allerede eksisterer)

**Leveringsadresse-seksjon** (vises kun for hjemlevering):
- Gateadresse (påkrevd)
- Postnummer (påkrevd)
- Poststed (påkrevd)

**Promokode-seksjon:**
- Input-felt for kode
- "Bruk kode" knapp
- Visuell feedback: grønn tekst "TESTMEG (-100%)" når gyldig

### Flyt for gratis bestilling
Når `discountedTotal === 0`:
- Hopp over Stripe-betaling
- Opprett ordre direkte i databasen
- Naviger til suksess-side

---

## Del 4: Oppdatert handlekurvsammendrag

**Fil:** `src/components/cart/CartSummary.tsx`

- Vise rabattlinje når promokode er aktiv
- Vise opprinnelig pris gjennomstreket
- Vise ny pris etter rabatt

---

## Del 5: Oppdatert mock-checkout

**Fil:** `src/lib/stripe-mock.ts`

Utvide `CreateCheckoutParams` med nye felter:
- customerName
- customerPhone
- shippingAddress
- promoCode

Oppdatere ordre-opprettelse til å inkludere alle data.

---

## Brukerflyt (komplett)

1. Bruker fyller inn konfigurasjon og legger i handlekurv
2. Går til checkout
3. Fyller inn navn og e-post
4. Velger leveringsmetode (henting eller hjemlevering)
5. Hvis hjemlevering: fyller inn adresse
6. Legger inn promokode "TESTMEG"
7. Ser at total blir 0 kr
8. Klikker "Fullfør bestilling"
9. Ordre opprettes i databasen (uten betaling)
10. Går til suksess-side

---

## Filer som endres

| Fil | Endring |
|-----|---------|
| `src/components/Header.tsx` | Fiks navigasjonslenker til forsiden |
| `src/types/shop.ts` | Nye typer for adresse og utvidet Order |
| `src/contexts/CartContext.tsx` | Promokode-logikk |
| `src/pages/Checkout.tsx` | Utvidet skjema + promokode-felt |
| `src/components/cart/CartSummary.tsx` | Vis rabatt |
| `src/lib/stripe-mock.ts` | Håndter nye felter i ordreopprettelse |

---

## Tekniske detaljer

### Promokode-validering
```typescript
const PROMO_CODES: Record<string, { type: 'percent' | 'fixed', value: number }> = {
  'TESTMEG': { type: 'percent', value: 100 }
}
```

### Gratis-bestilling logikk
```typescript
if (discountedTotal === 0) {
  // Opprett ordre direkte uten Stripe
  await createFreeOrder(orderData)
  navigate('/checkout/success')
} else {
  // Vanlig Stripe-flyt
  await createStripeCheckout(orderData)
}
```

### Validering
- Navn: påkrevd, minst 2 tegn
- E-post: påkrevd, gyldig format
- Telefon: valgfritt, ingen validering
- Adressefelt: påkrevd kun når leveringsmetode er "shipping"
