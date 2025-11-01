# Guía de Deployment - Cloudflare Workers

## Step-by-Step: De Cero a Producción

### ⚡ Quick Start (5 minutos)

```bash
# 1. Instalar dependencias
cd worker
yarn install

# 2. Instalar Wrangler
npm install -g wrangler

# 3. Login a Cloudflare
wrangler login
# Se abrirá tu browser para autenticar

# 4. Configurar secrets
wrangler secret put EVM_PRIVATE_KEY
# Pegar tu private key

wrangler secret put RPC_URL
# Ejemplo: https://base-mainnet.g.alchemy.com/v2/TU_API_KEY

# 5. Deploy!
yarn deploy

# 6. Test
curl https://x402-facilitator.YOUR_SUBDOMAIN.workers.dev/health
```

¡Listo! Tu facilitator está live.

---

## 📋 Checklist Pre-Deployment

### 1. Cuenta de Cloudflare

- [ ] Crear cuenta en [dash.cloudflare.com](https://dash.cloudflare.com) (gratis)
- [ ] Agregar método de pago (requerido para Workers Paid - $5/mes)
- [ ] Verificar email

### 2. Preparar Wallet del Facilitator

- [ ] Crear una wallet nueva para el facilitator
- [ ] Guardar private key de forma segura
- [ ] Fondear con ETH/USDC para gas (ej: $100)
- [ ] **NUNCA** compartir esta private key

**Recomendación:** Usa una wallet multi-sig para producción.

### 3. RPC Provider

Necesitas un RPC para interactuar con blockchain:

**Opciones gratuitas:**
- [Alchemy](https://www.alchemy.com/) - 300M compute units/mes gratis
- [Infura](https://www.infura.io/) - 100k requests/día gratis
- [QuickNode](https://www.quicknode.com/) - Free tier

**Setup Alchemy (recomendado):**

1. Crea cuenta en alchemy.com
2. Create App → Name: "x402-facilitator", Chain: Base
3. Copia la URL: `https://base-mainnet.g.alchemy.com/v2/YOUR_KEY`

---

## 🔧 Configuración Paso a Paso

### Paso 1: Setup Wrangler

```bash
# Instalar Wrangler CLI globalmente
npm install -g wrangler

# Verificar instalación
wrangler --version

# Login a Cloudflare
wrangler login
```

Se abrirá tu browser. Autoriza la aplicación.

### Paso 2: Configurar Secrets

Los secrets son variables encriptadas. **Nunca** pongas claves privadas en código.

```bash
# Private key del facilitator
wrangler secret put EVM_PRIVATE_KEY
# Cuando pregunte, pega: 0xTU_PRIVATE_KEY_AQUI

# RPC URL
wrangler secret put RPC_URL
# Cuando pregunte, pega: https://base-mainnet.g.alchemy.com/v2/TU_KEY

# CORS origins (opcional - default es *)
wrangler secret put ALLOWED_ORIGINS
# Ejemplo: https://tuapp.com,https://admin.tuapp.com
```

**Verificar secrets:**
```bash
wrangler secret list
```

### Paso 3: Editar wrangler.toml (Opcional)

Si quieres cambiar configuración:

```toml
# wrangler.toml
name = "x402-facilitator"  # Nombre único global
main = "src/index.ts"
compatibility_date = "2025-01-01"

[vars]
ENVIRONMENT = "production"
LOG_LEVEL = "info"  # debug | info | warn | error
```

### Paso 4: Deploy a Staging

Siempre testea en staging primero:

```bash
# Configurar secrets para staging
wrangler secret put EVM_PRIVATE_KEY --env staging
wrangler secret put RPC_URL --env staging

# Deploy
yarn deploy:staging
```

URL: `https://x402-facilitator-staging.YOUR_SUBDOMAIN.workers.dev`

### Paso 5: Testing en Staging

```bash
# Health check
curl https://x402-facilitator-staging.YOUR_SUBDOMAIN.workers.dev/health

# Supported networks
curl https://x402-facilitator-staging.YOUR_SUBDOMAIN.workers.dev/supported

# Test con payment real (usa base-sepolia testnet)
curl -X POST https://x402-facilitator-staging.YOUR_SUBDOMAIN.workers.dev/verify \
  -H "Content-Type: application/json" \
  -d @test-payment.json
```

### Paso 6: Deploy a Production

Si staging funciona:

```bash
# Configurar secrets para production
wrangler secret put EVM_PRIVATE_KEY --env production
wrangler secret put RPC_URL --env production
wrangler secret put ALLOWED_ORIGINS --env production

# Deploy
yarn deploy:production
```

URL: `https://x402-facilitator-production.YOUR_SUBDOMAIN.workers.dev`

---

## 🌐 Custom Domain (Opcional)

### Opción 1: Subdomain de tu dominio en Cloudflare

Si ya tienes un dominio en Cloudflare:

1. **Editar wrangler.toml:**

```toml
[[env.production.routes]]
pattern = "facilitator.tudominio.com/*"
zone_name = "tudominio.com"
```

2. **Deploy:**

```bash
yarn deploy:production
```

3. **Verificar:**

```bash
curl https://facilitator.tudominio.com/health
```

SSL es automático.

### Opción 2: Agregar dominio a Cloudflare

Si tu dominio está en otro registrar (GoDaddy, Namecheap, etc.):

1. **Agregar sitio en Cloudflare Dashboard:**
   - Workers & Pages → Add site
   - Sigue el wizard

2. **Cambiar nameservers** en tu registrar a los de Cloudflare

3. **Configurar route** como en Opción 1

---

## 📊 Monitoreo Post-Deployment

### Ver Logs en Tiempo Real

```bash
# Production logs
wrangler tail --env production

# Filtrar por errores
wrangler tail --env production | grep ERROR

# JSON format
wrangler tail --env production --format json
```

### Cloudflare Dashboard

1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Workers & Pages → "x402-facilitator-production"
3. Verás:
   - **Metrics**: Requests, errors, CPU time
   - **Logs**: Últimas 24 horas
   - **Settings**: Configuración

### Configurar Alertas

Dashboard → Notifications → Add:

1. **Worker Exceeded CPU Limit**
   - Trigger: >10ms average
   - Action: Email

2. **Worker Errored**
   - Trigger: >5% error rate
   - Action: Email + Webhook

3. **Traffic Anomaly**
   - Trigger: 50% increase
   - Action: Email

---

## 🔄 CI/CD con GitHub Actions

Automatiza deployments en cada push.

### .github/workflows/deploy.yml

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main
      - staging

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd worker
          yarn install

      - name: Deploy to Staging
        if: github.ref == 'refs/heads/staging'
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: worker
          command: deploy --env staging

      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: worker
          command: deploy --env production
```

### Setup GitHub Secrets

1. **Generar API Token en Cloudflare:**
   - Dashboard → My Profile → API Tokens
   - Create Token → Edit Cloudflare Workers
   - Copy token

2. **Agregar a GitHub:**
   - Repo → Settings → Secrets → Actions
   - New secret: `CLOUDFLARE_API_TOKEN`
   - Paste token

3. **Agregar secrets del worker:**

```yaml
# En el workflow, antes de deploy:
- name: Configure Secrets
  run: |
    echo "${{ secrets.EVM_PRIVATE_KEY }}" | wrangler secret put EVM_PRIVATE_KEY --env production
    echo "${{ secrets.RPC_URL }}" | wrangler secret put RPC_URL --env production
```

**IMPORTANTE:** Configura `EVM_PRIVATE_KEY` y `RPC_URL` en GitHub Secrets.

---

## 🐛 Troubleshooting

### Error: "Authentication failed"

```bash
# Re-login
wrangler logout
wrangler login
```

### Error: "Worker name already taken"

Cambia el `name` en `wrangler.toml` a algo único:

```toml
name = "x402-facilitator-tu-nombre"
```

### Error: "Module not found: x402"

```bash
cd worker
yarn install
```

### Worker responde lento

Verifica el RPC:
```bash
curl -X POST https://base-mainnet.g.alchemy.com/v2/YOUR_KEY \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

Si es lento, cambia de RPC provider.

### Errors 500 en producción

```bash
# Ver logs
wrangler tail --env production

# Buscar el error específico
wrangler tail --env production --format json | jq '.logs[] | select(.level == "error")'
```

---

## 📈 Scaling

Cloudflare Workers escala automáticamente. No configuration needed.

**Free tier:**
- 100k requests/día
- Suficiente para <3k pagos/día

**Paid ($5/mes):**
- 10M requests/mes
- ~300k pagos/día
- Si superas: $0.50/millón adicional

**Enterprise:**
- Unlimited
- SLA 100% uptime
- Contact sales

---

## 🔐 Security Best Practices

### ✅ DO:
- Usar secrets para EVM_PRIVATE_KEY
- Usar RPC privado (no público)
- Configurar ALLOWED_ORIGINS en producción
- Monitorear logs regularmente
- Fondear wallet solo lo necesario
- Usar multi-sig para wallets grandes

### ❌ DON'T:
- Commitear .env con secrets
- Compartir private keys
- Usar RPC públicos en production
- Dejar CORS abierto (*) en production
- Ignorar alertas
- Fondear wallet con todo tu capital

---

## 📞 Soporte

**Cloudflare Workers:**
- [Docs](https://developers.cloudflare.com/workers/)
- [Discord](https://discord.cloudflare.com)
- [Community Forum](https://community.cloudflare.com)

**x402:**
- [GitBook](https://x402.gitbook.io/x402)
- [GitHub Issues](https://github.com/coinbase/x402/issues)

---

## ✅ Post-Deployment Checklist

- [ ] Worker deployed a production
- [ ] Health check responde 200
- [ ] /supported retorna redes correctas
- [ ] Test de /verify exitoso
- [ ] Test de /settle exitoso
- [ ] Logs monitoreándose
- [ ] Alertas configuradas
- [ ] Custom domain (si aplica)
- [ ] CI/CD configurado
- [ ] Documentación actualizada
- [ ] Team notificado de la URL

---

**¡Felicidades! Tu facilitator x402 está en producción 🎉**
