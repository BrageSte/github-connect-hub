

# Plan: Order Intake + Production Queue System

## Oversikt

Bygger et komplett ordrehåndteringssystem med Supabase som database, Edge Functions for Stripe-integrasjon, og et admin-panel for manuell produksjon. Systemet er designet for manuell drift nå, men med arkitektur klar for full automatisering senere.

## Arkitektur

```text
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                   │
├─────────────────────────────────────────────────────────────────────┤
│  Konfigurator → Handlekurv → Checkout → Stripe Checkout → Success  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SUPABASE EDGE FUNCTIONS                       │
├─────────────────────────────────────────────────────────────────────┤
│  /create-checkout-session     │  /stripe-webhook                    │
│  - Lagrer config_snapshot     │  - Verifiserer Stripe signatur      │
│  - Oppretter Stripe Session   │  - Oppretter/oppdaterer ordre       │
│  - Returnerer checkout URL    │  - Sender admin e-post via Resend   │
│                               │  - Logger alle events               │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SUPABASE DATABASE                            │
├─────────────────────────────────────────────────────────────────────┤
│  orders            │  order_events       │  files                  │
│  - config_snapshot │  - event log        │  - STEP/preview files   │
│  - shipping_address│  - idempotency      │  - linked to orders     │
│  - status workflow │  - debugging        │  - future use           │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          ADMIN PANEL                                │
├─────────────────────────────────────────────────────────────────────┤
│  /admin             │  /admin/orders/:id                           │
│  - Ordreliste       │  - Ordredetaljer                             │
│  - Filtrer på status│  - Kopier parametre                          │
│  - Søk              │  - Endre status                              │
│                     │  - Interne notater                           │
└─────────────────────────────────────────────────────────────────────┘
```

## Del 1: Datamodell (SQL-migrasjoner)

### Tabell: `orders`

| Kolonne | Type | Beskrivelse |
|---------|------|-------------|
| `id` | uuid | Primary key |
| `created_at` | timestamptz | Opprettet |
| `updated_at` | timestamptz | Sist endret |
| `status` | text | `new`, `manual_review`, `in_production`, `ready_to_print`, `printing`, `shipped`, `done`, `error` |
| `config_version` | int | Versjonsnummer for fremtidig kompatibilitet |
| `stripe_checkout_session_id` | text | Unik, for idempotency |
| `stripe_payment_intent_id` | text | For referanse |
| `customer_name` | text | Kundens navn |
| `customer_email` | text | Kundens e-post |
| `customer_phone` | text | Telefon (valgfritt) |
| `delivery_method` | text | `shipping`, `pickup-gneis`, `pickup-oslo`, `digital` |
| `shipping_address` | jsonb | Adresse fra Stripe |
| `pickup_location` | text | Hentested-ID |
| `delivery_notes` | text | Leveringsnotater |
| `config_snapshot` | jsonb | Alle produktkonfigurasjoner |
| `line_items` | jsonb | Produktlinjer med pris |
| `subtotal_amount` | int | I øre |
| `shipping_amount` | int | I øre |
| `total_amount` | int | I øre |
| `currency` | text | NOK |
| `internal_notes` | text | Admin-notater |
| `error_message` | text | Feilmeldinger |

### Tabell: `order_events`

| Kolonne | Type | Beskrivelse |
|---------|------|-------------|
| `id` | uuid | Primary key |
| `order_id` | uuid | FK → orders |
| `created_at` | timestamptz | Tidspunkt |
| `event_type` | text | F.eks. `stripe.checkout.session.completed` |
| `payload` | jsonb | Full event-data |

### Tabell: `files` (for fremtidig bruk)

| Kolonne | Type | Beskrivelse |
|---------|------|-------------|
| `id` | uuid | Primary key |
| `order_id` | uuid | FK → orders |
| `created_at` | timestamptz | Opprettet |
| `file_type` | text | `step`, `stl`, `preview`, `other` |
| `storage_path` | text | Supabase Storage path |
| `original_filename` | text | Originalt filnavn |

### RLS Policies

- `orders`: Kun lesing for authenticated admin-bruker
- `order_events`: Kun lesing for authenticated admin
- `files`: Kun lesing for authenticated admin

## Del 2: Edge Functions

### 1. `create-checkout-session`

**Formål:** Oppretter Stripe Checkout Session med all konfig-data

**Input:**
```json
{
  "items": [
    {
      "product": { "id": "...", "name": "...", "price": 449, "config": {...} },
      "quantity": 1
    }
  ],
  "email": "kunde@example.com",
  "deliveryMethod": "shipping"
}
```

**Flyt:**
1. Validér input
2. Beregn totaler (subtotal, frakt, total)
3. Bygg `config_snapshot` fra alle items
4. Opprett Stripe Checkout Session med:
   - Line items (produkt + frakt)
   - `metadata`: `config_snapshot` (JSON-string)
   - `success_url` og `cancel_url`
5. Returner `{ url: session.url }`

### 2. `stripe-webhook`

**Formål:** Håndterer Stripe-events og oppretter ordrer

**Events som håndteres:**
- `checkout.session.completed`

**Flyt:**
1. Verifiser Stripe-signatur
2. Parse event
3. Sjekk idempotency: Finnes ordre med `stripe_checkout_session_id`?
   - Ja: Logg event, returner 200
   - Nei: Opprett ordre
4. Lagre event i `order_events`
5. Send admin e-post via Resend med:
   - Ordre-ID og lenke til admin-panel
   - Kundeinfo (navn, e-post, telefon)
   - Leveringsadresse/hentested
   - Produktkonfigurasjon (formatert)
6. Returner 200

### Secrets som kreves

| Variabel | Beskrivelse |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe API-nøkkel |
| `STRIPE_WEBHOOK_SECRET` | Webhook-signering |
| `RESEND_API_KEY` | For admin-e-post |
| `ADMIN_EMAIL` | Din e-postadresse |

## Del 3: Frontend-oppdateringer

### Checkout-flyt

Erstatter `stripe-mock.ts` med ekte Stripe-kall:

1. **Checkout.tsx**: Kaller `supabase.functions.invoke('create-checkout-session')`
2. Stripe håndterer betaling
3. **CheckoutSuccess.tsx**: Viser ordrebekreftelse (henter fra URL-params)

### Nye typer

Utvider `src/types/shop.ts` med:
- `OrderStatus` enum
- `OrderEvent` interface
- `ConfigSnapshot` interface

## Del 4: Admin-panel

### `/admin` (Ordreliste)

- Tabell med alle ordrer
- Kolonner: Ordre-ID, Dato, Kunde, Status, Total
- Filtrering på status
- Sortering (nyeste først)
- Klikk på rad → Ordredetaljer

### `/admin/orders/:id` (Ordredetaljer)

**Seksjon: Kundeinformasjon**
- Navn, e-post, telefon
- Leveringsmetode + adresse/hentested

**Seksjon: Produktkonfigurasjon**
- Blokktype (Short/Long Edge)
- Fingerbredder (formatert tabell)
- Høyder
- Dybde
- Total bredde
- **Kopier parametre**-knapp (genererer tekstblokk)

**Seksjon: Ordrestatus**
- Status-dropdown med alle statuser
- Lagre-knapp
- Interne notater (textarea)

**Seksjon: Filer** (forberedes, ikke implementeres fullt)
- Placeholder for fremtidig STEP-opplasting

### Admin-autentisering

For MVP: Enkel passord-beskyttelse eller Supabase Auth med admin-rolle.

## Del 5: E-postvarsling

### Admin-notifikasjon (ved ny ordre)

**Fra:** BS Climbing <noreply@bsclimbing.no>
**Til:** ADMIN_EMAIL
**Emne:** 🧗 Ny ordre #{orderId}

**Innhold:**
```
NY ORDRE MOTTATT

Ordre: #BS-ABC123
Tidspunkt: 2026-02-01 14:30

KUNDE
Navn: Ola Nordmann
E-post: ola@example.com
Telefon: +47 123 45 678

LEVERING
Metode: Hjemlevering
Adresse:
  Storgata 1
  0123 Oslo
  Norge

PRODUKTER
1x Stepper Short Edge (449,-)
   Bredder: 21 | 20 | 21 | 22 mm
   Høyder: 10 | 15 | 20 | 17 mm
   Dybde: 20 mm
   Total: 100.0 mm

Subtotal: 449,-
Frakt: 79,-
TOTALT: 528,-

[Se ordre i admin-panel]
https://bsclimbing.lovable.app/admin/orders/abc123
```

## Implementeringsrekkefølge

| Steg | Beskrivelse |
|------|-------------|
| 1 | Aktivere Supabase (koble til Cloud) |
| 2 | Opprette database-tabeller (migrasjoner) |
| 3 | Sette opp secrets (Stripe, Resend) |
| 4 | Lage Edge Function: `create-checkout-session` |
| 5 | Lage Edge Function: `stripe-webhook` |
| 6 | Oppdatere frontend Checkout-flyt |
| 7 | Bygge Admin-panel (liste + detaljer) |
| 8 | Konfigurere Stripe webhook endpoint |
| 9 | Teste fullstendig flyt |

## Filendringer

### Nye filer

| Fil | Beskrivelse |
|-----|-------------|
| `supabase/functions/create-checkout-session/index.ts` | Stripe checkout |
| `supabase/functions/stripe-webhook/index.ts` | Webhook handler |
| `src/pages/admin/AdminLayout.tsx` | Admin wrapper |
| `src/pages/admin/OrderList.tsx` | Ordreliste |
| `src/pages/admin/OrderDetails.tsx` | Ordredetaljer |
| `src/pages/admin/AdminLogin.tsx` | Enkel innlogging |
| `src/types/admin.ts` | Admin-typer |
| `src/lib/supabase.ts` | Supabase client |
| `src/hooks/useOrders.ts` | React Query hooks |

### Endrede filer

| Fil | Endring |
|-----|---------|
| `src/App.tsx` | Legge til admin-routes |
| `src/pages/Checkout.tsx` | Bruke ekte Stripe |
| `src/pages/CheckoutSuccess.tsx` | Hente ordre fra DB |
| `src/types/shop.ts` | Utvide med OrderStatus etc. |

## Tekniske detaljer

### Idempotency

Webhook-handleren bruker `stripe_checkout_session_id` som unik nøkkel:
- Sjekker om ordre eksisterer før opprettelse
- Logger alle events i `order_events` uansett
- Returnerer alltid 200 for å unngå Stripe retries

### Config Snapshot Format

```json
{
  "version": 1,
  "items": [
    {
      "productId": "printed-shortedge-21-20-21-22-20-...",
      "type": "printed",
      "blockVariant": "shortedge",
      "widths": {
        "lillefinger": 21,
        "ringfinger": 20,
        "langfinger": 21,
        "pekefinger": 22
      },
      "heights": {
        "lillefinger": 10,
        "ringfinger": 15,
        "langfinger": 20,
        "pekefinger": 17
      },
      "depth": 20,
      "totalWidth": 100.0,
      "quantity": 1,
      "unitPrice": 449
    }
  ]
}
```

## Fremtidig utvidelse (ikke nå)

Arkitekturen støtter:
- STEP-generering via CAD-API
- Automatisk filopplasting til `files`-tabell
- Print queue-integrasjon
- Frakt-API (Bring/Posten)
- Kunde-e-post ved statusendringer

