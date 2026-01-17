const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('Setting up proxy for Football-Data.org...');
  
  app.use(
    '/api/football-data',
    createProxyMiddleware({
      target: 'https://api.football-data.org',
      changeOrigin: true,
      secure: true,
      logLevel: 'debug',
      pathRewrite: function (path, req) {
        // Transformer /api/football-data/v4/matches en /v4/matches
        const newPath = path.replace(/^\/api\/football-data/, '');
        console.log('Path rewrite:', path, '->', newPath);
        return newPath;
      },
      onProxyReq: (proxyReq, req, res) => {
        // Valeur directement dans le code
        const apiToken = '48b3e12dda0a4f6eb0e983abe4388681';
        
        console.log('Proxy Request:', req.method, req.url);
        console.log('Original URL:', req.originalUrl);
        
        if (apiToken && apiToken.trim() !== '') {
          proxyReq.setHeader('X-Auth-Token', apiToken);
          console.log('Proxy: Added X-Auth-Token header');
        } else {
          console.warn('Proxy: REACT_APP_FOOTBALL_DATA_KEY not found in environment and no default key');
          console.warn('Available env vars:', Object.keys(process.env).filter(k => k.includes('FOOTBALL')));
        }
        
        // Ajouter les headers nécessaires
        proxyReq.setHeader('Accept', 'application/json');
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Proxy Response:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('Proxy error for', req.url, ':', err.message);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Proxy error', details: err.message });
        }
      },
    })
  );
  
  console.log('Proxy configured for /api/football-data');
};

