# SmartCart - submission checklist

## Required links

- Live Vercel production URL: https://smartcart-project-ruddy.vercel.app
- GitHub repository: https://github.com/mimi5588/smartcart-project
- Supabase project: `smartcart-project` (`uyvptavudduzlsxkmtwa`)
- Deployment status document: [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)
- ERD document: [SUPABASE_ERD.md](./SUPABASE_ERD.md)

## Demo data

- Demo user: May Cohen (`may`)
- Additional demo profile available in the app: Noa Levi (`noa`)
- No login is required for the course demo.
- The shopping flow starts from the home screen, then store setup, simulated scan, list, insights, and profile.

## Main user flow

1. Open the live Vercel URL.
2. Start shopping from the home screen.
3. Choose a supermarket.
4. Go to the scanner.
5. Select or scan a demo product.
6. Add the product or accept a cheaper/healthier swap.
7. Open the shopping list and mark items as completed.
8. Open insights to view savings and basket analysis.
9. Open profile to edit budget, avatar, household members, and dietary preferences.

## External services and integrations

| Service | Type | Role in the product | Required for core demo |
| --- | --- | --- | --- |
| Vercel | Hosting / deployment | Hosts the production React/Vite app and serverless API route. | Yes |
| Supabase | Database / Data API | Stores SmartCart demo user state in `public.smartcart_states` with RLS and explicit grants. | Yes |
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

## Verification already completed

- Production deployment is `READY`.
- Live URL returns HTTP 200.
- Supabase table `public.smartcart_states` exists.
- RLS is enabled on `public.smartcart_states`.
- The Supabase Data API is reachable with the publishable key.
- `npm run build` passes.
- `npm run lint` passes.
- `npm audit --omit=dev` reports 0 production vulnerabilities.
- Vercel production runtime logs had no `error` or `fatal` entries in the last check.

