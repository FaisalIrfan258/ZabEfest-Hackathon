# Eco Tracker - Environmental Monitoring App

An application for tracking and reporting environmental issues in your community.

## Features

- User authentication (login, signup, password reset)
- Dashboard to view environmental statistics
- Report environmental incidents
- View incidents on a map
- Track your eco contributions

## Environment Setup

To run this application, you'll need to set up the following environment variables:

1. Create a `.env.local` file in the root directory of the project:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
```

Replace `http://localhost:5000/api` with your actual backend URL.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication Routes

The application uses the following authentication routes:

- `/auth/register` - Register a new user
- `/auth/login` - Login with email, username, or CNIC and password
- `/auth/forgot-password/user` - Request password reset using CNIC
- `/auth/reset-password/{token}` - Reset password with token

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
