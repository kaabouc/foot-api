# Guide Rapide : Configuration API-Football (RapidAPI)

## ✅ C'est GRATUIT avec 100 requêtes/jour !

API-Football via RapidAPI est **beaucoup mieux** que Football-Data.org pour le plan gratuit car :
- ✅ Plus de matchs disponibles (1000+ ligues)
- ✅ Plus de compétitions (Premier League, La Liga, Bundesliga, etc.)
- ✅ 100 requêtes/jour (vs 10/min pour Football-Data.org)
- ✅ Plus fiable et plus de données

## 🚀 Étapes pour obtenir votre clé gratuite

### 1. Créer un compte RapidAPI

1. Allez sur : **https://rapidapi.com/api-sports/api/api-football**
2. Cliquez sur **"Subscribe to Test"** ou **"Basic Plan"** (gratuit)
3. Créez un compte RapidAPI (c'est gratuit, pas besoin de carte de crédit)

### 2. Obtenir votre clé API

1. Une fois connecté, allez dans votre **Dashboard** (en haut à droite)
2. Cliquez sur **"Security"** ou **"My Apps"**
3. Trouvez **"Application Key"** ou **"X-RapidAPI-Key"**
4. **Copiez votre clé** (elle ressemble à : `abc123def456...`)

### 3. Ajouter la clé dans votre projet

Ouvrez le fichier `.env` dans le dossier racine (`D:\Project\foot`) et ajoutez :

```env
REACT_APP_API_FOOTBALL_KEY=votre_cle_ici
```

**Remplacez `votre_cle_ici` par votre vraie clé API !**

### 4. Redémarrer le serveur React

⚠️ **IMPORTANT** : Après avoir ajouté la clé dans `.env`, vous **DEVEZ** redémarrer le serveur React :

1. Arrêtez le serveur (Ctrl+C dans le terminal)
2. Relancez : `npm start`

Le serveur doit être redémarré pour charger les nouvelles variables d'environnement.

## 🎯 Résultat attendu

Une fois configuré, l'application utilisera automatiquement **API-Football en priorité** et vous verrez beaucoup plus de matchs !

L'ordre de priorité est :
1. **API-Football** (si clé configurée) ← **RECOMMANDÉ**
2. Football-Data.org (si clé configurée)
3. OpenLigaDB (toujours disponible)

## 📊 Limites du plan gratuit

- ✅ **100 requêtes par jour**
- ✅ Fonctionne parfaitement pour une utilisation personnelle/démo
- ✅ Pas de carte de crédit requise
- ✅ Pas de limite de temps (plan gratuit permanent)

Pour un projet personnel ou une démonstration, 100 requêtes/jour est largement suffisant !

## 🐛 Dépannage

### "You are not subscribed to this API" (Erreur 403)
- Vérifiez que vous êtes bien abonné au plan "Basic" (gratuit)
- Vérifiez que votre clé API est correcte
- Redémarrez le serveur React après avoir ajouté la clé

### "Rate limit exceeded" (Erreur 429)
- Vous avez utilisé vos 100 requêtes/jour
- Attendez jusqu'au lendemain (les limites sont réinitialisées chaque jour)
- Ou utilisez Football-Data.org comme backup

## 💡 Astuce

Une fois configuré, vous verrez dans la console du navigateur (F12) :
```
✅✅✅ API-Football SUCCESS! Returned 15 match(es)
🎉 Using API-Football results - matches found!
```

Cela signifie que tout fonctionne parfaitement ! 🎉

