# Solution Proxy pour CORS - Instructions

## Problème
L'API Football-Data.org bloque les requêtes CORS depuis le navigateur. Nous avons créé un serveur proxy séparé pour contourner cela.

## Solution 1 : Serveur Proxy Séparé (Recommandé)

### Étape 1 : Activer le proxy séparé dans .env

Ajoutez cette ligne dans votre fichier `.env` :
```
REACT_APP_USE_SEPARATE_PROXY=true
```

### Étape 2 : Démarrer le serveur proxy

Dans un **nouveau terminal** (laissez le serveur React tourner), exécutez :

```bash
npm run proxy
```

Vous devriez voir :
```
🚀 Proxy server running on http://localhost:3001
📡 Proxying requests to: https://api.football-data.org
🔑 API Key configured: Yes
```

### Étape 3 : Démarrer React (si pas déjà fait)

Dans un autre terminal :
```bash
npm start
```

### Étape 4 : Tester

Ouvrez votre navigateur sur `http://localhost:3000` et activez le toggle "Utiliser l'API". Les requêtes devraient maintenant passer par le proxy sur le port 3001.

## Solution 2 : Démarrer tout en une fois

Vous pouvez utiliser le script qui démarre automatiquement le proxy et React :

```bash
npm run dev
```

⚠️ **Note** : Cette commande nécessite `concurrently` (déjà installé).

## Vérification

### Dans le terminal du proxy (port 3001) :
Vous devriez voir des logs comme :
```
[2026-01-09T...] Proxy Request: GET /api/football-data/v4/matches?dateFrom=...
[2026-01-09T...] Proxy Response: 200 for /api/football-data/v4/matches...
```

### Dans la console du navigateur :
- ✅ Pas d'erreur CORS
- ✅ Les requêtes vont vers `http://localhost:3001/api/football-data/v4/matches`
- ✅ Les matchs se chargent depuis l'API

## Solution Alternative : setupProxy.js (si vous préférez)

Si vous préférez utiliser le proxy intégré dans React (`setupProxy.js`), vous devez :

1. **Ne pas ajouter** `REACT_APP_USE_SEPARATE_PROXY=true` dans `.env` (ou le mettre à `false`)
2. **Arrêter complètement** le serveur React
3. **Redémarrer** avec `npm start`
4. **Vérifier** dans le terminal du serveur React que vous voyez :
   ```
   Setting up proxy for Football-Data.org...
   Proxy configured for /api/football-data
   ```

Si ces messages n'apparaissent PAS, `setupProxy.js` n'est pas chargé et vous devez utiliser la Solution 1 (serveur proxy séparé).

## Troubleshooting

### Le proxy ne démarre pas
- Vérifiez que le port 3001 n'est pas déjà utilisé
- Vérifiez que le fichier `.env` contient bien votre token API

### Les requêtes retournent encore 404
- Assurez-vous que le proxy est bien démarré sur le port 3001
- Vérifiez dans `.env` que `REACT_APP_USE_SEPARATE_PROXY=true`
- Redémarrez le serveur React après avoir modifié `.env`

### Les requêtes retournent 401/403
- Vérifiez que votre token API est correct dans le fichier `.env`
- Vérifiez que le proxy affiche "API Key configured: Yes"

