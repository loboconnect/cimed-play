# CIMED PLAY - Agent Rules

## Project Context
This is CIMED PLAY - a media and entertainment streaming platform based on Next.js 14, Supabase, Firebase FCM, and Vercel. It evolved from a political campaign system (campanha-digital-2026).

## Stack
- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Supabase (Auth + DB + Realtime)
- Firebase FCM (push notifications - currently disabled)
- Vercel (deployment)
- GitHub: loboconnect/cimed-play

## Golden Rules - NEVER violate these
1. Before ANY change: explain exactly what file and what lines will be modified. Wait for user confirmation.
2. Never change architecture without explicit authorization
3. Never delete files without explicit authorization
4. One problem at a time - confirm working before moving to next
5. Never modify working components to fix something else
6. Always analyze completely before proposing any change
7. If unsure - ask, don't guess

## What is currently working (DO NOT BREAK)
- Login: app/login/page.tsx - uses createBrowserClient from @supabase/ssr
- Dashboard: app/dashboard/page.tsx - session via getSession()
- Operations Center: app/dashboard/operations/page.tsx - role-based access (admin/operator)
- Operational Console: components/OperationalConsole.tsx - Supabase Realtime
- Middleware: middleware.ts - createServerClient with cookie handler
- Operations API: app/api/operations/route.ts - createServerClient server-side

## Supabase Tables
- users (id int8, email text, role text) - role: admin or operator
- operational_commands (id uuid, command_type text, payload jsonb, issued_by text, status text, created_at timestamptz)
- device_tokens (id uuid, fcm_token text, device_type text)

## Visual Identity - CIMED PLAY
- Primary color: #FFC600 (yellow)
- Secondary color: #2D2926 (dark/black)
- Platform name: CIMED PLAY
- Description: Sports entertainment and digital streaming platform

## Push Notifications
- Currently DISABLED - do not re-enable without explicit user request
- Firebase config exists but notifications are paused for now

## Deployment Flow
- Edit in Replit Shell or Agent
- Push to GitHub: loboconnect/cimed-play
- Vercel auto-deploys on push to main
- Test at: cimed-play.vercel.app
