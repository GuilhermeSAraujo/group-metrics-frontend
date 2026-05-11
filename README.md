# lstop Dashboard

A Vite + React + Chakra UI analytics dashboard for lstop servers, deployed on GitHub Pages.

## Setup

### 1. Update the repo name in `vite.config.js`

```js
base: '/your-repo-name/',
```

Replace `your-repo-name` with the exact name of your GitHub repository.

### 2. Install & run locally

```bash
npm install
npm run dev
```

### 3. Deploy to GitHub Pages

**Enable GitHub Pages in your repo:**
1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**

Then push to `main` — the workflow in `.github/workflows/deploy.yml` builds and deploys automatically.

## Routes

Uses `HashRouter` for GitHub Pages compatibility.

| Path | Description |
|------|-------------|
| `/#/dashboard` | Main analytics dashboard |
| `/*` | Redirects to `/#/dashboard` |

## Charts (placeholders)

Three chart slots available via the selector:
- **Messages per User** — bar chart
- **Reactions Received per User** — bar chart
- **Replies Received per User** — bar chart
