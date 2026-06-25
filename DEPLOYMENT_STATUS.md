# SmartCart Deployment Status

- Production URL: `https://smartcart-project-ruddy.vercel.app`
- Vercel project: `maycohen5588-1132s-projects/smartcart-project`
- Supabase project: configured via environment variables
- Supabase auth: email/password users
- Supabase tables used by the app: `public.smartcart_profiles`, `public.smartcart_states`
- Admin account email: `maycohen5588@gmail.com`
- Client env keys: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- The app stores authenticated user state in Supabase first and keeps `localStorage` as a per-user offline fallback.
