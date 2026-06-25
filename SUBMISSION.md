# SmartCart - submission checklist

## Required links

- Live Vercel production URL: https://smartcart-project-ruddy.vercel.app
- GitHub repository: https://github.com/mimi5588/smartcart-project
- Supabase project: configured via environment variables
- Deployment status document: [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)
- ERD document: [SUPABASE_ERD.md](./SUPABASE_ERD.md)

## Production users

- Login is required with Supabase email/password authentication.
- Existing demo users and demo shopping data were removed from Supabase.
- Admin account email: `maycohen5588@gmail.com`
- New users can register from the app login screen.

## Main user flow

1. Open the live Vercel URL.
2. Sign in or create a new account.
3. Choose a supermarket.
4. Go to the scanner.
5. Select or scan a product.
6. Add the product or accept a cheaper/healthier swap.
7. Open the shopping list and mark items as completed.
8. Open insights to view savings and basket analysis.
9. Open profile to edit budget, avatar, household members, and dietary preferences.

## External services and integrations

| Service | Type | Role in the product | Required for core demo |
| --- | --- | --- | --- |
| Vercel | Hosting / deployment | Hosts the production React/Vite app and serverless API route. | Yes |
| Supabase | Auth / Database / Data API | Handles email/password auth and stores user profiles/state with RLS. | Yes |
| OpenAI API | AI API | Optional in-app assistant responses through `api/assistant.js`. The app has local fallback answers if the key is missing. | No |
| Browser Cache Storage API | Browser API | Caches external HTTP images when relevant for faster reloads. | No |
| Recharts | UI library | Renders spending and savings charts in the insights dashboard. | Yes |

## Environment variables

Configured in Vercel for Production, Preview, and Development:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Optional for the assistant API:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`

## Verification checklist

- Production deployment is `READY`.
- Live URL returns HTTP 200.
- Supabase Auth accepts the configured admin email/password.
- Supabase tables `public.smartcart_profiles` and `public.smartcart_states` exist.
- RLS is enabled on both app tables.
- The Supabase Data API is reachable with the publishable key.
- `npm run build` passes.
- `npm run lint` passes.
- No Supabase service-role key is exposed in frontend code or Vercel client env.
