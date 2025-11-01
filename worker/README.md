# x402 Facilitator - Cloudflare Workers

Implementación profesional de un facilitator x402 desplegado en Cloudflare Workers con edge computing global.

## 🚀 Features

- ✅ **Ultra-rápido**: Edge computing con latencia <50ms globalmente
- ✅ **Escalado infinito**: Automático sin configuración
- ✅ **Seguro**: Secrets encriptados, CORS configurado, validación Zod
- ✅ **Observabilidad**: Logging estructurado JSON, métricas incluidas
- ✅ **Multi-network**: Soporta todas las redes EVM (Base, Ethereum, etc.)
- ✅ **Tipo-seguro**: TypeScript estricto con tipos x402
- ✅ **Production-ready**: Error handling, health checks, rate limiting

## 📁 Estructura

```
worker/
├── src/
│   ├── index.ts              # Entry point (Hono app)
│   ├── handlers/
│   │   ├── health.ts         # GET /health
│   │   ├── supported.ts      # GET /supported
│   │   ├── verify.ts         # POST /verify
│   │   └── settle.ts         # POST /settle
│   ├── middleware/
│   │   ├── cors.ts           # CORS handling
│   │   ├── errorHandler.ts  # Error handling
│   │   └── logger.ts         # Request logging
│   ├── utils/
│   │   ├── logger.ts         # Structured logger
│   │   └── cors.ts           # CORS utilities
│   └── types/
│       └── index.ts          # TypeScript types
├── wrangler.toml             # Cloudflare config
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Setup

### Prerequisitos

- Node.js 20+
- Cuenta de Cloudflare (gratis para empezar)
- Wrangler CLI

### Instalación

```bash
cd worker
yarn install

# Instalar Wrangler globalmente
npm install -g wrangler

# Login a Cloudflare
wrangler login
```

### Configuración de Secrets

Cloudflare Workers usa **secrets encriptados** para datos sensibles. NUNCA pongas claves privadas en código o archivos.

```bash
# Configurar private key del facilitator
wrangler secret put EVM_PRIVATE_KEY
# Pegar tu private key cuando pregunte

# Configurar RPC URL (Alchemy, Infura, etc.)
wrangler secret put RPC_URL
# Ejemplo: https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Configurar orígenes permitidos (opcional)
wrangler secret put ALLOWED_ORIGINS
# Ejemplo: https://tudominio.com,https://app.tudominio.com
```

Para ambiente staging:

```bash
wrangler secret put EVM_PRIVATE_KEY --env staging
wrangler secret put RPC_URL --env staging
```

Para producción:

```bash
wrangler secret put EVM_PRIVATE_KEY --env production
wrangler secret put RPC_URL --env production
```

## 💻 Desarrollo Local

```bash
# Iniciar en modo desarrollo
yarn dev

# El worker estará en http://localhost:8787
```

Wrangler crea un entorno local que simula el runtime de Workers.

### Testing Local

```bash
# Health check
curl http://localhost:8787/health

# Supported networks
curl http://localhost:8787/supported

# Verify payment
curl -X POST http://localhost:8787/verify \
  -H "Content-Type: application/json" \
  -d '{
    "paymentPayload": {...},
    "paymentRequirements": {...}
  }'

# Settle payment
curl -X POST http://localhost:8787/settle \
  -H "Content-Type: application/json" \
  -d '{
    "paymentPayload": {...},
    "paymentRequirements": {...}
  }'
```

## 🚢 Deployment

### Deploy a Staging

```bash
yarn deploy:staging
```

Esto despliega a `x402-facilitator-staging.workers.dev`

### Deploy a Production

```bash
yarn deploy:production
```

Esto despliega a `x402-facilitator-production.workers.dev`

### Configurar Dominio Custom

1. Agrega tu dominio a Cloudflare (DNS)
2. En `wrangler.toml`, descomenta y configura:

```toml
[[env.production.routes]]
pattern = "facilitator.tudominio.com/*"
zone_name = "tudominio.com"
```

3. Deploy:

```bash
yarn deploy:production
```

SSL/TLS es automático con Cloudflare.

## 📊 Monitoreo

### Ver Logs en Tiempo Real

```bash
# Development
wrangler tail

# Staging
wrangler tail --env staging

# Production
wrangler tail --env production

# JSON format para parsing
yarn logs
```

### Dashboard de Cloudflare

1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Workers & Pages → tu worker
3. Verás:
   - Requests per second
   - Errores
   - CPU time
   - Bandwidth
   - Logs históricos

### Alertas

Configura alertas en Cloudflare Dashboard:
- High error rate (>5%)
- High CPU usage
- Request surge

## 🔒 Seguridad

### Implementado ✅

- **Secrets encriptados**: Private keys nunca en código
- **CORS**: Configurable por origen
- **Validación Zod**: Todos los inputs validados
- **Error handling**: Sin leaks de información sensible
- **Rate limiting**: Built-in en Workers (10k req/min gratis)
- **DDoS protection**: Automático por Cloudflare
- **HTTPS**: SSL/TLS automático
- **Logging**: Todas las operaciones auditadas

### Checklist Pre-Production

- [ ] Secrets configurados (EVM_PRIVATE_KEY, RPC_URL)
- [ ] ALLOWED_ORIGINS configurado para producción
- [ ] Dominio custom configurado
- [ ] Alertas configuradas en dashboard
- [ ] Wallet del facilitator fondeado con gas
- [ ] Tests ejecutados en staging
- [ ] Logs monitoreados

## 📖 API Endpoints

### GET /

Info del facilitator

**Response:**
```json
{
  "name": "x402 Payment Facilitator",
  "version": "1.0.0",
  "description": "Cloudflare Workers implementation",
  "endpoints": {...}
}
```

### GET /health

Health check del worker

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### GET /supported

Redes y schemes soportados

**Response:**
```json
{
  "version": "1.0.0",
  "facilitator": "x402-facilitator-cloudflare",
  "schemes": [
    { "scheme": "erc3009", "network": "base" },
    { "scheme": "erc3009", "network": "base-sepolia" },
    ...
  ]
}
```

### POST /verify

Verifica un pago

**Request:**
```json
{
  "paymentPayload": {
    "version": "1.0",
    "scheme": "erc3009",
    ...
  },
  "paymentRequirements": {
    "network": "base",
    "price": "$0.10",
    ...
  }
}
```

**Response:**
```json
{
  "valid": true,
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### POST /settle

Ejecuta settlement de un pago

**Request:**
```json
{
  "paymentPayload": {...},
  "paymentRequirements": {...}
}
```

**Response:**
```json
{
  "success": true,
  "transactionHash": "0x...",
  "network": "base",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## 🐛 Troubleshooting

### Error: "Missing EVM_PRIVATE_KEY"

```bash
wrangler secret put EVM_PRIVATE_KEY
```

### Error: "Unsupported network"

Verifica que la red esté en `SupportedEVMNetworks`. Actualmente:
- base
- base-sepolia
- ethereum
- sepolia
- polygon
- mumbai
- arbitrum
- arbitrum-sepolia
- optimism
- optimism-sepolia
- avalanche
- avalanche-fuji

### Logs no aparecen

```bash
# Asegúrate de estar en el ambiente correcto
wrangler tail --env production

# O en JSON
wrangler tail --format json
```

### Worker no responde

1. Verifica deployment: `wrangler deployments list`
2. Revisa logs: `wrangler tail`
3. Chequea dashboard de Cloudflare para errores

## 💰 Costos

### Cloudflare Workers Pricing

**Free Tier:**
- 100,000 requests/día
- 10ms CPU time por request
- Suficiente para desarrollo y testing

**Paid ($5/mes):**
- 10 millones requests/mes incluidos
- 50ms CPU time por request
- $0.50 por millón adicional
- DDoS protection ilimitado

**Tu caso de uso:**
- Si procesas 1M pagos/mes: **$5/mes**
- Si procesas 100M pagos/mes: **~$50/mes**

Mucho más barato que VPS ($12-50/mes) con mejor performance.

## 📚 Recursos

- [x402 Protocol](https://www.x402.org/)
- [x402 GitHub](https://github.com/coinbase/x402)
- [x402 GitBook](https://x402.gitbook.io/x402)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Hono Framework](https://hono.dev/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## 🤝 Soporte

Issues? Abre un issue en el repo o contacta al equipo.

---

**Built with ⚡ on Cloudflare Workers**
