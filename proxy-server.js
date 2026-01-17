// Serveur proxy simple pour contourner CORS
// Utilisez ce serveur en parallèle de React: node proxy-server.js

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001; // Port différent du serveur React (3000)

// Activer CORS pour permettre les requêtes depuis localhost:3000
app.use(cors());

// Proxy pour Football-Data.org
app.use(
  '/api/football-data',
  createProxyMiddleware({
    target: 'https://api.football-data.org',
    changeOrigin: true,
    secure: true,
    pathRewrite: {
      '^/api/football-data': '', // Enlever le préfixe
    },
    onProxyReq: (proxyReq, req, res) => {
      // Ajouter le header X-Auth-Token - valeur directement dans le code
      const apiToken = '48b3e12dda0a4f6eb0e983abe4388681';
      
      if (apiToken && apiToken.trim() !== '') {
        proxyReq.setHeader('X-Auth-Token', apiToken);
        console.log(`[${new Date().toISOString()}] Proxy Request: ${req.method} ${req.url} | Token: ${apiToken.substring(0, 8)}...`);
      } else {
        console.warn('⚠️  REACT_APP_FOOTBALL_DATA_KEY not found and no default key available');
        console.warn('Available env vars with FOOTBALL:', Object.keys(process.env).filter(k => k.includes('FOOTBALL')));
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[${new Date().toISOString()}] Proxy Response: ${proxyRes.statusCode} for ${req.url}`);
    },
    onError: (err, req, res) => {
      console.error('❌ Proxy Error:', err.message);
      res.status(500).json({ error: 'Proxy error', details: err.message });
    },
  })
);

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying requests to: https://api.football-data.org`);
  console.log(`🔑 API Key configured: ${process.env.REACT_APP_FOOTBALL_DATA_KEY ? 'Yes' : 'No'}`);
  console.log('\n👉 Make sure React dev server is running on port 3000');
});

