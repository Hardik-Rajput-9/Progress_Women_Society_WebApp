This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## CinematicHero (scroll-driven)

The homepage renders a scroll-driven hero from `components/CinematicHero.tsx`.

### How to test

1. Start the client dev server from the `client` folder:

```bash
npm run dev
```

2. Open `http://localhost:3000/`.

3. Scroll through the top hero section:

- At the start, hands should be fully off-screen and the sun starts near the bottom.
- As you scroll, hands move diagonally in and meet exactly at the center while the sun rises behind them.
- On further scroll past the meeting moment, hands fade out and the logo fades/zooms in with a soft glow.

### Viewport checks

- Desktop (>= 768px): uses `/assets/images/hand-*-desktop.svg`.
- Mobile (< 768px): uses `/assets/images/hand-*-mobile.svg`.

### Assets

Hero assets live under `public/assets/images/` and are referenced with `/assets/images/...` paths.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
