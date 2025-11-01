# x420-facilitator

Monorepo para x420 Facilitator, un facilitator de pagos que implementa el protocolo x402. Incluye backend facilitator, deployment en Cloudflare Workers, y frontend web.

## Estructura del Proyecto

```
x420-facilitator/
├── backend/          # Facilitator API (Express + TypeScript) - Legacy
├── worker/           # Cloudflare Workers deployment (Hono + TypeScript) - RECOMENDADO ⭐
└── frontend/         # Interfaz web (Next.js + shadcn/ui)
```

## 🚀 Quick Start - Cloudflare Workers (Recomendado)

```bash
# 1. Setup Worker
cd worker
yarn install
npm install -g wrangler
wrangler login

# 2. Configurar secrets
wrangler secret put EVM_PRIVATE_KEY
wrangler secret put RPC_URL

# 3. Deploy
yarn deploy

# 4. Test
curl https://x402-facilitator.YOUR_SUBDOMAIN.workers.dev/health
```

Ver [worker/README.md](worker/README.md) para más detalles.

## Address Facilitator

```shell
0xf970be6543cd20ff1f7570959949e31fa16fba7b
```

## Backend (Facilitator API)

El backend es un servidor Express que maneja la verificación y settlement de pagos implementando el protocolo x402.

### Setup Backend

```bash
cd backend
yarn install
```

### Development

```bash
cd backend
yarn dev
```

### Build

```bash
cd backend
yarn build
```

### Run Production

```bash
cd backend
yarn start
```

## Frontend (Next.js + shadcn/ui)

El frontend proporciona una interfaz web para interactuar con el facilitator.

### Setup Frontend

```bash
cd frontend
yarn install
```

### Development

```bash
cd frontend
yarn dev
```

El frontend estará disponible en `http://localhost:3000`

### Build

```bash
cd frontend
yarn build
```

### Run Production

```bash
cd frontend
yarn start
```

## Variables de Entorno

### Backend

Crea un archivo `.env` en el directorio `backend/`:

```env
EVM_PRIVATE_KEY=tu_private_key
RPC_URL=tu_rpc_url
PORT=3000
```

### Frontend

Crea un archivo `.env.local` en el directorio `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

