# Supabase Integration Setup

This guide explains how to set up Supabase authentication and API integration for the SOVS mobile app.

## Prerequisites

1. Supabase project running (local or cloud)
2. Supabase URL and API keys
3. Cloud functions deployed

## Environment Variables

Create a `.env` file in the root of the `sovs-mobile-app` directory with the following variables:

```env
EXPO_PUBLIC_SUPABASE_URL=http://72.60.37.106:8000
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
EXPO_PUBLIC_FUNCTIONS_URL=http://72.60.37.106:8000/functions/v1
```

**Note:** The credentials are already configured in `services/supabase.ts` as defaults, so you don't need to create a `.env` file unless you want to override them.

### Getting Your Supabase Keys

1. **Supabase URL**: Your Supabase project URL (e.g., `http://localhost:8000` for local or `https://your-project.supabase.co` for cloud)

2. **Anon Key**: Found in your Supabase project settings under "API" → "Project API keys" → "anon/public" key

3. **Functions URL**: The base URL for your Supabase Edge Functions (usually `{SUPABASE_URL}/functions/v1`)

## Installation

Install the Supabase client library:

```bash
npm install @supabase/supabase-js
```

Or if using yarn:

```bash
yarn add @supabase/supabase-js
```

## How It Works

### Registration Flow

1. User completes identity verification (camera + ID scan)
2. User confirms government data
3. On account creation:
   - User record is created in the `users` table via cloud function (`/users` POST endpoint)
   - User is registered in Supabase Auth for authentication
   - User is assigned the "voter" role (default)

### Login Flow

1. User enters phone number or email
2. System checks if user exists in `users` table via `find-user` endpoint
3. OTP is sent via Supabase Auth (SMS for phone, email for email)
4. User verifies OTP
5. User is authenticated and redirected to dashboard

## Cloud Functions Used

- `users` - CRUD operations for users table
- `find-user` - Find user by phone or email
- `government-db` - Query government database records

## Authentication Methods

The app supports two authentication methods:

1. **Phone-based**: Uses Supabase Auth phone OTP
2. **Email-based**: Uses Supabase Auth email OTP/magic link

## Troubleshooting

### "Missing required env vars" Error

Make sure your `.env` file is properly configured and the variables are prefixed with `EXPO_PUBLIC_` for Expo to expose them to the client.

### "User already exists" Error

This can happen if:
- User was previously registered
- Registration was partially completed

The system handles this gracefully and will attempt to retrieve the existing user.

### OTP Not Received

- Check Supabase Auth settings for SMS/Email providers
- Verify phone number/email format
- Check Supabase logs for delivery errors

## Testing

To test the integration:

1. Start your Supabase instance
2. Ensure all cloud functions are deployed
3. Run the app: `npm run dev`
4. Try registering a new user
5. Try logging in with the registered credentials

## Notes

- The app uses Supabase Auth for authentication but stores user data in a custom `users` table
- Password hashing is handled by Supabase Auth
- Sensitive fields (`password_hash`, `two_factor_secret`) are never exposed to the client
- All API calls use SERVICE_ROLE_KEY to bypass RLS (configured in cloud functions)
