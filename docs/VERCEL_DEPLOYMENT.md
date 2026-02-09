# Vercel deployment – Supabase data not showing

If you added data in Supabase and set env variables on Vercel but the deployed app still shows old/mock data, use this checklist.

## 1. Env variable names (exact)

In Vercel → Project → Settings → Environment Variables, use **exactly**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Vite only exposes variables that start with `VITE_` to the client. They are baked in at **build time**, so typos or different names mean the app gets empty values.

## 2. Same Supabase project

The URL and key on Vercel must be for the **same** Supabase project where you see the data:

1. In [Supabase Dashboard](https://supabase.com/dashboard) open the project that has your data.
2. Go to **Project Settings** (gear) → **API**.
3. Copy **Project URL** and **anon public** key (not the `service_role` key).
4. In Vercel, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to these values (for Production and optionally Preview).

## 3. Redeploy after changing env

After adding or editing env variables:

1. Go to Vercel → your project → **Deployments**.
2. Open the **⋯** menu on the latest deployment.
3. Choose **Redeploy**.
4. Turn **on** “Clear cache and redeploy” so the new env is used in the build.

Without a new deploy (and preferably a cache-clear), the old build with old or empty env is still served.

## 4. Confirm in Supabase

- In that same project, **Table Editor** → `patients` (and related tables) and confirm rows are there.
- In **Project Settings** → **API**, confirm the anon key is enabled and that RLS policies allow read for anon if you use them.

If all of the above are correct and you still don’t see Supabase data on Vercel, the next step is to check the browser Network tab and console on the deployed URL for failed requests or errors.
