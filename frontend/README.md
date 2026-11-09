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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Conexión con el backend (MatchPlay)

1. Backend corriendo en `http://localhost:3000/api` (MongoDB activo).
2. `npm install` y `npm run dev` (el front queda en `http://localhost:3001` si el 3000 está ocupado por el backend; ejecuta `npm run dev -- -p 3001`).
3. Opcional: copiar `.env.local.example` a `.env.local`.

Archivos de la conexión: `app/lib/api.ts` (rutas, token, errores) y `app/lib/adaptadores.ts` (forma del backend -> forma de las pantallas).
- Solicitudes = eventos `tipo=personal`; pestaña Eventos = `tipo=comunidad`.
- Crear evento: `POST /eventos` + `POST /eventos/:id/publicar`.
