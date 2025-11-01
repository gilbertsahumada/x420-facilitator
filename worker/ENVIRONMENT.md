# Environment Variables Guide

## Required Variables

The x402 facilitator requires the following environment variables to function:

### 1. EVM_PRIVATE_KEY
- **Description**: Private key of the facilitator wallet (must include `0x` prefix)
- **Type**: Secret (encrypted)
- **Example**: `0xabc123def456...`
- **Used for**: Signing and executing settlement transactions on-chain

### 2. ALCHEMY_API_KEY
- **Description**: Alchemy API key for RPC access (key only, not full URL)
- **Type**: Secret (encrypted)
- **Example**: `abc123def456...`
- **Used for**: Connecting to Avalanche and Avalanche Fuji networks

### 3. ALLOWED_ORIGINS (Optional)
- **Description**: Comma-separated list of allowed CORS origins
- **Type**: Secret (encrypted)
- **Default**: `*` (allow all)
- **Example**: `https://myapp.com,https://admin.myapp.com`
- **Used for**: CORS validation

---

## How to Configure

### For Local Development (.dev.vars)

Create a file `worker/.dev.vars`:

```bash
EVM_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
ALCHEMY_API_KEY=your_alchemy_api_key
ALLOWED_ORIGINS=*
```

Then run:
```bash
yarn dev
```

### For Staging

```bash
wrangler secret put EVM_PRIVATE_KEY --env staging
# Paste your private key when prompted

wrangler secret put ALCHEMY_API_KEY --env staging
# Paste your Alchemy API key

wrangler secret put ALLOWED_ORIGINS --env staging
# Paste allowed origins (or * for all)
```

### For Production

```bash
wrangler secret put EVM_PRIVATE_KEY --env production
wrangler secret put ALCHEMY_API_KEY --env production
wrangler secret put ALLOWED_ORIGINS --env production
```

---

## How to Verify Variables are Set

### Local Development

When you run `yarn dev`, if variables are missing you'll see:

```json
{
  "error": "Configuration error",
  "message": "Missing required environment variables: EVM_PRIVATE_KEY, ALCHEMY_API_KEY",
  "help": "Please configure secrets using: wrangler secret put <SECRET_NAME>"
}
```

### Staging/Production

After deploying, test the health endpoint:

```bash
curl https://your-worker.workers.dev/health
```

If variables are missing, you'll get a 500 error with the missing variables listed.

### List Current Secrets

```bash
# List secrets (shows names only, not values)
wrangler secret list

# For specific environment
wrangler secret list --env production
```

---

## Security Best Practices

### ✅ DO:
- Keep `.dev.vars` in `.gitignore` (already configured)
- Use different private keys for staging and production
- Use testnet (Fuji) for staging
- Rotate private keys periodically
- Use a dedicated wallet for the facilitator (not your personal wallet)

### ❌ DON'T:
- Commit `.dev.vars` to git
- Share private keys
- Use production private key in staging
- Hardcode secrets in code
- Expose private keys in logs

---

## Troubleshooting

### Error: "Missing required environment variables: EVM_PRIVATE_KEY"

**Local Development:**
```bash
# Create .dev.vars file
cd worker
cat > .dev.vars << 'VARS'
EVM_PRIVATE_KEY=0xYOUR_KEY
ALCHEMY_API_KEY=your_key
VARS
```

**Staging/Production:**
```bash
wrangler secret put EVM_PRIVATE_KEY --env production
```

### Error: "Missing required environment variables: ALCHEMY_API_KEY"

**Get Alchemy API Key:**
1. Go to [alchemy.com](https://www.alchemy.com/)
2. Create account (free)
3. Create app → Chain: Avalanche
4. Copy API key (not the full URL, just the key part)

**Then configure:**
```bash
wrangler secret put ALCHEMY_API_KEY
```

### How to update a secret

```bash
# Just run the same command again
wrangler secret put EVM_PRIVATE_KEY --env production
# Enter new value when prompted
```

### How to delete a secret

```bash
wrangler secret delete EVM_PRIVATE_KEY --env production
```

---

## Example .dev.vars

```bash
# Facilitator wallet private key (testnet wallet recommended)
EVM_PRIVATE_KEY=0x1234567890abcdef...

# Alchemy API key (create app for Avalanche Fuji testnet)
ALCHEMY_API_KEY=abc123def456ghi789...

# CORS (allow all for local dev)
ALLOWED_ORIGINS=*
```

---

## Getting Your Alchemy API Key

### Step 1: Create Alchemy Account
- Go to https://www.alchemy.com/
- Sign up (free tier available)

### Step 2: Create App
- Dashboard → Create App
- **Name**: `x402-facilitator-fuji` (for staging) or `x402-facilitator-avax` (for production)
- **Chain**: Avalanche
- **Network**: Fuji Testnet (staging) or Mainnet (production)

### Step 3: Get API Key
- Click on your app
- Click "View Key"
- Copy the **API KEY** (not the full HTTPS URL)
- It looks like: `abc123def456...`

### Step 4: Configure
```bash
wrangler secret put ALCHEMY_API_KEY
# Paste the key when prompted
```

---

## Environment-Specific Configuration

### Development (.dev.vars)
- Use **Avalanche Fuji** testnet
- Use a test wallet with test AVAX
- CORS: `*` (allow all)

### Staging (wrangler secrets)
- Use **Avalanche Fuji** testnet
- Use a dedicated staging wallet
- CORS: specific origins

### Production (wrangler secrets)
- Use **Avalanche C-Chain** mainnet
- Use a dedicated production wallet with proper funding
- CORS: production origins only
- Consider multi-sig wallet for added security

