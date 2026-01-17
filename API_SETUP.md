# Guide d'utilisation de l'API - Football Matches

Ce guide vous explique comment configurer l'API pour récupérer des données réelles de matchs de football.

## 📋 Options d'API disponibles

L'application supporte deux APIs principales :

### 1. Football-Data.org (Recommandé pour débuter)

**Avantages:**
- ✅ Gratuit et facile à configurer
- ✅ Pas besoin de carte de crédit
- ✅ 10 requêtes/minute gratuitement
- ✅ Documentation simple

**Comment obtenir une clé API:**

1. Allez sur https://www.football-data.org/
2. Cliquez sur "Register" en haut à droite
3. Créez un compte gratuit
4. Une fois connecté, allez dans "API" → "Token"
5. Copiez votre token (commence par "YOUR_API_KEY")

**Limitations:**
- 10 requêtes par minute
- Certaines ligues peuvent être limitées

### 2. API-Football (RapidAPI)

**Avantages:**
- ✅ Plus de données et ligues disponibles
- ✅ 100 requêtes/jour en plan gratuit
- ✅ Données très complètes

**Comment obtenir une clé API:**

1. Allez sur https://rapidapi.com/api-sports/api/api-football
2. Cliquez sur "Subscribe to Test" (Plan gratuit)
3. Créez un compte RapidAPI (si nécessaire)
4. Inscrivez-vous au plan gratuit "Basic"
5. Dans le dashboard, allez dans "Security" → "Application Key"
6. Copiez votre clé X-RapidAPI-Key

**Limitations:**
- 100 requêtes par jour (plan gratuit)
- Nécessite un compte RapidAPI

## 🚀 Configuration

### Étape 1: Créer le fichier `.env`

Dans le dossier racine du projet (`D:\Project\foot`), créez un fichier nommé `.env` (sans extension).

### Étape 2: Ajouter votre clé API

Ouvrez le fichier `.env` et ajoutez votre clé API :

**Option 1: Avec Football-Data.org**
```env
REACT_APP_FOOTBALL_DATA_KEY=votre_token_ici
```

**Option 2: Avec API-Football (RapidAPI)**
```env
REACT_APP_API_FOOTBALL_KEY=votre_cle_rapidapi_ici
```

**Option 3: Utiliser les deux**
```env
REACT_APP_FOOTBALL_DATA_KEY=votre_token_football_data
REACT_APP_API_FOOTBALL_KEY=votre_cle_api_football
```

### Étape 3: Redémarrer le serveur de développement

Après avoir créé le fichier `.env`, vous devez redémarrer votre serveur React :

1. Arrêtez le serveur actuel (Ctrl + C dans le terminal)
2. Redémarrez avec `npm start`

**Important:** Les variables d'environnement ne sont chargées qu'au démarrage de l'application. Vous devez toujours redémarrer après avoir modifié `.env`.

## 🔍 Comment ça fonctionne ?

L'application essaie automatiquement de récupérer les données depuis les APIs dans cet ordre :

1. **D'abord API-Football** (si `REACT_APP_API_FOOTBALL_KEY` est configuré)
2. **Puis Football-Data.org** (si `REACT_APP_FOOTBALL_DATA_KEY` est configuré)
3. **En dernier, les données mockées** (si aucune API ne fonctionne)

## 🎛️ Utilisation dans l'application

Dans l'interface de l'application :

1. **Toggle API/Démonstration** : En haut de la page, vous pouvez activer/désactiver l'utilisation de l'API
   - ✅ Activé : Utilise les données réelles de l'API
   - ❌ Désactivé : Utilise les données de démonstration (mockées)

2. **Filtres** : Utilisez les boutons pour voir les matchs d'hier, aujourd'hui ou demain

## ⚠️ Résolution des problèmes

### "API non configurée"
- Vérifiez que le fichier `.env` existe à la racine du projet
- Vérifiez que la clé API est correctement nommée (commence par `REACT_APP_`)
- Redémarrez le serveur React après avoir modifié `.env`

### "Erreur lors du chargement"
- Vérifiez votre connexion internet
- Vérifiez que votre clé API est valide
- Vérifiez les limites de votre plan API (nombre de requêtes)
- Consultez la console du navigateur (F12) pour plus de détails

### "Aucun match trouvé"
- Vérifiez la date : certaines APIs peuvent ne pas avoir de matchs pour certaines dates
- Les matchs peuvent être en pause (vacances, etc.)
- Essayez une autre date

### Les données ne se mettent pas à jour
- Les données sont mises en cache par le navigateur
- Rechargez la page (F5)
- Vérifiez que vous avez assez de requêtes API disponibles

## 📝 Notes importantes

1. **Sécurité** : Ne partagez jamais votre clé API publiquement
2. **Limites** : Respectez les limites de votre plan API
3. **Cache** : Les APIs peuvent avoir un délai de mise à jour des données
4. **Données mockées** : En cas d'erreur, l'application bascule automatiquement sur les données de démonstration

## 🔗 Liens utiles

- Football-Data.org : https://www.football-data.org/
- API-Football (RapidAPI) : https://rapidapi.com/api-sports/api/api-football
- Documentation React : https://react.dev/

---

**Besoin d'aide ?** Consultez la console du navigateur (F12 → Console) pour voir les messages d'erreur détaillés.

