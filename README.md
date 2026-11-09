# MatchPlay

App para encontrar con quién hacer deporte. Proyecto académico, Pontificia Universidad Javeriana Cali.

| Carpeta | Tecnología | Despliegue |
|---|---|---|
| `frontend/` | Next.js (App Router) | Vercel |
| `backend/` | NestJS + Mongoose | Railway |
| Base de datos | MongoDB | Atlas |

## Correr en local

**Backend**

```bash
cd backend
cp .env.example .env      # y completar JWT_SECRET y MONGODB_URI
npm install
npm run start:dev         # http://localhost:3000/api
```

**Frontend**

```bash
cd frontend
npm install
npm run dev -- -p 3001    # http://localhost:3001
```

## Variables de entorno

| Dónde | Variable | Ejemplo |
|---|---|---|
| Backend (Railway) | `MONGODB_URI` | connection string de Atlas |
| Backend (Railway) | `JWT_SECRET` | texto largo y aleatorio |
| Backend (Railway) | `JWT_EXPIRES_IN` | `7d` |
| Frontend (Vercel) | `NEXT_PUBLIC_API_URL` | `https://<backend>.up.railway.app/api` |
| Frontend (Vercel) | `NEXT_PUBLIC_MODO_DEMO` | `false` |

Los archivos `.env` no se suben al repositorio; hay ejemplos en `backend/.env.example` y `frontend/.env.local.example`.
