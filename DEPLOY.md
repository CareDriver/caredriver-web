# Deployment Guide for CareDriver Web

## Cloudflare Pages Deployment

### Build Settings

1. **Framework**: Next.js
2. **Build Command**: `npm ci && npm run build && rm -rf .next/cache`
3. **Build Output Directory**: `.next/static` (or leave empty for auto-detection)
4. **Node.js Version**: 20.x (recommended)

### Environment Variables

Add these in Cloudflare Pages > Settings > Environment Variables:

- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `caredriver-61ac3`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = `caredriver-61ac3.appspot.com`
- `FIREBASE_PRIVATE_KEY` = (from firebase service account)
- `FIREBASE_CLIENT_EMAIL` = (from firebase service account)

### Important Notes

- The `.next/cache` directory is removed after build to ensure file sizes stay under 25 MiB limit
- Firebase Admin SDK is properly isolated to server-side routes only
- Client bundle includes only the necessary Firebase SDK (not Admin)

### Local Testing

Before deploying, test locally:

```bash
npm ci
npm run build
npm run start
```

Check build output for warnings about large files:

```bash
find .next/static -type f -size +1M -exec ls -lh {} \;
```

## Vercel Deployment (Alternative)

If you prefer Vercel:

1. **Build Command**: `npm run build`
2. **Output Directory**: (auto-detected)
3. Vercel will handle Next.js optimizations automatically

## GitHub Actions (CI/CD)

Example workflow:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20.x
      - run: npm ci
      - run: npm run build
      - run: rm -rf .next/cache
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: caredriver-web
          directory: .next/static
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```
