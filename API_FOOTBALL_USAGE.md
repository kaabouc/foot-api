# Guide d'utilisation API-Football (RapidAPI)

## ✅ Endpoint correct pour récupérer les matchs

Pour récupérer les matchs d'une date spécifique, utilisez :

```
GET https://api-football-v1.p.rapidapi.com/v3/fixtures?date=YYYY-MM-DD
```

**Exemple pour aujourd'hui :**
```bash
curl --request GET \
  --url 'https://api-football-v1.p.rapidapi.com/v3/fixtures?date=2026-01-14' \
  --header 'x-rapidapi-host: api-football-v1.p.rapidapi.com' \
  --header 'x-rapidapi-key: VOTRE_CLE_ICI'
```

## ❌ Endpoint que vous avez montré

L'endpoint `/fixtures/headtohead?h2h=33-34` sert à obtenir l'historique des confrontations entre deux équipes spécifiques (team IDs 33 et 34), pas à obtenir tous les matchs d'une date.

## 📋 Endpoints disponibles pour les matchs

### 1. Matchs par date (RECOMMANDÉ pour votre application)
```
GET /v3/fixtures?date=YYYY-MM-DD
```
Retourne tous les matchs programmés pour une date donnée.

### 2. Matchs par ligue
```
GET /v3/fixtures?league=39&season=2024
```
Retourne les matchs d'une ligue spécifique (39 = Premier League).

### 3. Matchs d'une équipe
```
GET /v3/fixtures?team=33&season=2024
```
Retourne les matchs d'une équipe spécifique.

### 4. Head-to-head (historique entre deux équipes)
```
GET /v3/fixtures/headtohead?h2h=33-34
```
Retourne l'historique des confrontations entre deux équipes.

## 🔧 Comment l'utiliser dans votre application

Votre code utilise déjà le bon endpoint ! Regardez dans `src/services/apiService.js` :

```javascript
const response = await axios.get(`${API_FOOTBALL_BASE_URL}/fixtures`, {
  params: {
    date: date  // Format: YYYY-MM-DD
  },
  headers: {
    'X-RapidAPI-Key': API_FOOTBALL_KEY,
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
  }
});
```

C'est exactement le bon format !

## 🚨 Important : Obtenir une vraie clé API

La clé que vous avez montrée (`8f1ae6fbb6msh1c7506d876c27f5p1b79a2jsn79a469b04574`) retourne **403 Forbidden** car elle n'est pas valide.

### Étapes pour obtenir votre clé gratuite :

1. **Allez sur** : https://rapidapi.com/api-sports/api/api-football
2. **Créez un compte** RapidAPI (gratuit)
3. **Cliquez sur "Subscribe to Test"** ou **"Basic Plan"** (gratuit)
4. **Dans votre dashboard** → **"Security"** → **"Application Key"**
5. **Copiez votre clé** (elle sera différente de celle que vous avez)

### Ajoutez-la dans `.env` :

```env
REACT_APP_API_FOOTBALL_KEY=votre_nouvelle_cle_ici
```

### Redémarrez le serveur React :

⚠️ **IMPORTANT** : Après avoir ajouté la clé, redémarrez React :
```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
npm start
```

## 📊 Format de réponse API-Football

L'API retourne les matchs dans cette structure :

```json
{
  "get": "fixtures",
  "parameters": {
    "date": "2026-01-14"
  },
  "errors": [],
  "results": 10,
  "paging": {
    "current": 1,
    "total": 1
  },
  "response": [
    {
      "fixture": {
        "id": 1035120,
        "date": "2026-01-14T20:00:00+00:00",
        "status": {
          "short": "NS",
          "long": "Not Started"
        }
      },
      "league": {
        "id": 39,
        "name": "Premier League",
        "country": "England"
      },
      "teams": {
        "home": {
          "id": 33,
          "name": "Manchester United"
        },
        "away": {
          "id": 34,
          "name": "Liverpool"
        }
      },
      "goals": {
        "home": null,
        "away": null
      }
    }
  ]
}
```

Votre code transforme automatiquement ce format en format compatible avec votre application.

## ✅ Une fois configuré

Avec une vraie clé API, vous verrez dans la console :
```
✅✅✅ API-Football SUCCESS! Returned 15 match(es)
🎉 Using API-Football results - matches found!
```

Et vous verrez les matchs s'afficher dans votre application ! 🎉

