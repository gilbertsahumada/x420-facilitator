# Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, create a `.env.local` file in the frontend directory with the following variables:

```bash
# Facilitator Address (Ethereum address)
NEXT_PUBLIC_FACILITATOR_ADDRESS=0x76b0d7aa45c0efeec787d3a661247fbe19416885

# Facilitator API URL
NEXT_PUBLIC_FACILITATOR_URL=https://facilitator.x420.cloud
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

All constants are centralized in `lib/constants.ts`. The facilitator address and API URL can be configured via environment variables:

- `NEXT_PUBLIC_FACILITATOR_ADDRESS`: The Ethereum address of the facilitator (required)
- `NEXT_PUBLIC_FACILITATOR_URL`: The API endpoint URL for the facilitator (optional, defaults to https://facilitator.x420.cloud)

## Constants

All application constants are exported from `@/lib/constants`:
- `FACILITATOR_ADDRESS`: The facilitator's Ethereum address
- `FACILITATOR_URL`: The facilitator API URL
- `NETWORKS`: Supported blockchain networks (for home page)
- `SUPPORTED_CHAINS`: Supported chains (for dashboard)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
