
# Plan: E-postbekreftelse og Testing av Gratis Bestilling

## Oversikt
Jeg vil nå implementere e-postbekreftelse til kunder og teste hele bestillingsflyten med TESTMEG-koden.

---

## Del 1: Legge til Resend API-nøkkel

API-nøkkelen du oppga (`re_CkJKD9NF_L3LnHRNYJBJ1Hznh9GornGm7`) vil bli lagt til som en hemmelighet i prosjektet.

---

## Del 2: Opprette Edge Function for E-post

Ny fil: `supabase/functions/send-order-confirmation/index.ts`

Funksjonen vil:
1. Motta ordre-ID og kundedata
2. Generere en HTML-e-post med ordredetaljer
3. Sende e-post via Resend til kunden

E-posten inkluderer:
- Ordrenummer
- Produktliste med priser
- Leveringsmetode og adresse
- Totalpris inkl. evt. rabatt

---

## Del 3: Oppdatere Checkout.tsx

Etter vellykket ordre-opprettelse:
1. Kalle edge-funksjonen for å sende e-postbekreftelse
2. Ikke blokkere navigasjon hvis e-post feiler (kun logge feilen)

---

## Del 4: Konfigurere Edge Function

Oppdatere `supabase/config.toml` med:
```toml
[functions.send-order-confirmation]
verify_jwt = false
```

---

## Del 5: Teste Bestillingsflyten

Etter implementasjon vil jeg:
1. Gå til konfigurator og velge et produkt
2. Gå til handlekurv
3. Fylle ut kontaktinfo og adresse
4. Legge inn TESTMEG promokoden
5. Fullføre bestilling
6. Verifisere at ordren lagres i databasen
7. Sjekke at e-postbekreftelse sendes

---

## Tekniske detaljer

### Edge Function Struktur:

```typescript
interface OrderConfirmationRequest {
  orderId: string
  customerEmail: string
  customerName: string
  items: Array<{ name: string; quantity: number; price: number }>
  deliveryMethod: string
  pickupLocation?: string
  shippingAddress?: {
    line1: string
    line2?: string
    postalCode: string
    city: string
  }
  subtotal: number
  shipping: number
  promoDiscount?: number
  total: number
}
```

### E-post Avsender:

**Viktig:** Resend krever et verifisert domene for å sende e-post. Uten verifisert domene kan vi bruke `onboarding@resend.dev` som testavsender, men e-post vil bare bli sendt til kontoadministratorens e-post.

For produksjon anbefales det å verifisere domenet `bsclimbing.no` på https://resend.com/domains.

---

## Filer som opprettes/endres

| Fil | Endring |
|-----|---------|
| (Secret) RESEND_API_KEY | Legges til i prosjektet |
| `supabase/config.toml` | Konfigurere edge function |
| `supabase/functions/send-order-confirmation/index.ts` | Ny edge function |
| `src/pages/Checkout.tsx` | Kalle edge function etter ordre-opprettelse |

---

## Forventet Resultat

1. Når en kunde fullfører en bestilling (gratis eller betalt), sendes en ordrebekreftelse på e-post
2. E-posten inneholder alle relevante ordredetaljer
3. Admin ser ordren i dashbordet med fullstendig data
4. Kunden får umiddelbar bekreftelse på kjøpet
