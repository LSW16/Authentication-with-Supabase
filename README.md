# Authentication Integration

## Project Description

This project is a React Native application that integrates Supabase Authentication. Users can create an account, sign in, and access protected application content.

## Features

- User registration and login using Supabase Authentication
- User sign-out
- Session persistence and restoration
- Protected dashboard navigation
- Public information displayed from Supabase
- Protected information displayed for authenticated users
- Form validation using Zod
- Form management using React Hook Form
- Loading indicators and error messages
- Supabase Row Level Security (RLS)

## Technologies Used

- React Native
- Expo
- TypeScript
- Supabase
- React Hook Form
- Zod
- Git and GitHub

## Project Structure

- `context/AuthContext.tsx` - Authentication context and session management
- `lib/supabase.ts` - Supabase client configuration
- `src/app/index.tsx` - Login and registration screen
- `src/app/home.tsx` - Protected dashboard
- `src/app/_layout.tsx` - Navigation and authentication protection

## Installation

1. Clone the GitHub repository.
2. Install dependencies by running:

   `npm install`

3. Create a `.env` file in the project root.
4. Add your Supabase project URL and publishable key:

   `EXPO_PUBLIC_SUPABASE_URL=your_supabase_url`

   `EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key`

5. Start the application:

   `npx expo start`

## Database

The application uses two Supabase tables:

- `public_info` - Public information available to visitors.
- `protected_items` - Information available only to authenticated users.

Row Level Security (RLS) is used to control access to protected information.

## Team Members

Le, Phuc
Lee, Seungwon
Vu, Van Dung

## Running the Project

Run `npx expo start` from the project directory.