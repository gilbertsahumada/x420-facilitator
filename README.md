# x420-facilitator

Monorepo para el sistema x402 Payment Protocol, incluyendo el facilitator backend y el frontend web.

## Estructura del Proyecto

```
x420-facilitator/
├── backend/          # Facilitator API (Express + TypeScript)
└── frontend/         # Interfaz web (Next.js + shadcn/ui)
```

## Address Facilitator

```shell
0xf970be6543cd20ff1f7570959949e31fa16fba7b
```

## Backend (Facilitator API)

El backend es un servidor Express que maneja la verificación y settlement de pagos x402.

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

