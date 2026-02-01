
# Plan: Lagre ordrer i databasen ved gratis checkout

## Problem
Når brukeren bestiller med TESTMEG promokoden (100% rabatt), lagres ordren kun i `sessionStorage` for å vise på suksess-siden. Ordren blir **aldri sendt til databasen**, så den vises ikke i admin-panelet.

I tillegg tillater de nåværende RLS-policies kun admins å opprette ordrer, noe som blokkerer vanlige kunder fra å fullføre bestillinger.

---

## Løsning

### Del 1: Oppdatere RLS-policy for ordrer

**Database-migrering:**

Legge til en policy som tillater alle (anon og authenticated) å opprette ordrer:

```sql
CREATE POLICY "Anyone can create orders"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
```

Dette er trygt fordi:
- Ordrer er betalingsbekreftelser, ikke sensitiv data
- Alle brukere (innlogget eller ikke) skal kunne bestille
- Admin-only SELECT/UPDATE-policies forblir uendret

---

### Del 2: Opprette funksjon for å lagre ordre

**Ny fil:** `src/lib/orderService.ts`

Funksjon som konverterer cart-data til database-format og inserter i Supabase:

```typescript
export async function createOrder(orderData: CreateOrderParams): Promise<string>
```

Funksjonen:
1. Mapper `CartItem[]` til `line_items` og `config_snapshot` JSON
2. Beregner `subtotal_amount`, `shipping_amount`, `total_amount` i øre (integer)
3. Setter `status: 'new'` for gratis ordrer (promokode)
4. Kaller `supabase.from('orders').insert()` 
5. Returnerer ordre-ID

---

### Del 3: Oppdatere Checkout.tsx

**Endringer i handleCheckout:**

Når `discountedTotal === 0`:
1. Kall `createOrder()` med alle skjemadata
2. Ved suksess: lagre forenklet ordre-info i sessionStorage for suksess-siden
3. Naviger til `/checkout/success`

---

### Del 4: Oppdatere CheckoutSuccess.tsx

Håndtere at ordren nå kommer fra databasen:
- Fortsatt hente ordre-info fra sessionStorage for visning
- Ingen endring i visningslogikk

---

## Tekniske detaljer

### Database-feltene som må fylles:

| Felt | Kilde |
|------|-------|
| `customer_name` | Skjema-input |
| `customer_email` | Skjema-input |
| `customer_phone` | Skjema-input (valgfritt) |
| `delivery_method` | CartContext |
| `shipping_address` | Skjema-input (JSON) |
| `pickup_location` | Fra delivery_method |
| `line_items` | Mappet fra CartItem[] |
| `config_snapshot` | Mappet fra CartItem[].product.config |
| `subtotal_amount` | Sum av produktpriser × 100 (øre) |
| `shipping_amount` | Fraktkostnad × 100 (øre) |
| `total_amount` | 0 (gratis ordre) |
| `status` | 'new' |
| `stripe_checkout_session_id` | 'free_order_' + timestamp |

### Mapping av CartItem til line_items:

```typescript
const lineItems = items.map(item => ({
  name: item.product.name,
  quantity: item.quantity,
  price: item.product.price * 100, // øre
  productId: item.product.id
}))
```

### Mapping til config_snapshot:

```typescript
const configSnapshot = {
  version: 1,
  items: items.map(item => ({
    productId: item.product.id,
    type: item.product.isDigital ? 'file' : 'printed',
    blockVariant: item.product.config?.blockVariant,
    widths: item.product.config?.widths,
    heights: item.product.config?.heights,
    depth: item.product.config?.depth,
    totalWidth: item.product.config?.totalWidth,
    quantity: item.quantity,
    unitPrice: item.product.price * 100
  }))
}
```

---

## Filer som endres

| Fil | Endring |
|-----|---------|
| Database-migrering | Ny INSERT-policy for ordrer |
| `src/lib/orderService.ts` | Ny fil med `createOrder()` funksjon |
| `src/pages/Checkout.tsx` | Kalle `createOrder()` ved gratis checkout |

---

## Brukerflyt etter endring

1. Bruker fyller ut skjema med navn, e-post, adresse
2. Bruker legger inn promokode TESTMEG
3. Total blir 0 kr
4. Bruker klikker "Fullfør bestilling"
5. **NY:** Ordre opprettes i databasen med status "new"
6. Ordre-info lagres i sessionStorage for suksess-visning
7. Bruker navigeres til suksess-siden
8. **NY:** Admin ser ordren i admin-panelet
