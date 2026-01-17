# Comment obtenir une clé RapidAPI valide

## 🚨 Problème actuel

Votre clé actuelle retourne **403 Forbidden** : "You are not subscribed to this API"

Cela signifie que :
- ❌ La clé n'est pas valide
- ❌ Vous n'êtes pas abonné au plan gratuit sur RapidAPI
- ❌ La clé est peut-être incomplète (46 caractères au lieu de 50)

## ✅ Solution : Obtenir une vraie clé

### Étape 1 : Créer/Connecter un compte RapidAPI

1. Allez sur : **https://rapidapi.com/**
2. Créez un compte (gratuit) ou connectez-vous

### Étape 2 : S'abonner à API-Football

1. Allez sur : **https://rapidapi.com/api-sports/api/api-football**
2. Cliquez sur **"Subscribe to Test"** ou **"Basic Plan"** (gratuit)
3. Confirmez l'abonnement (gratuit, pas besoin de carte de crédit)

### Étape 3 : Obtenir votre clé API

1. Dans votre dashboard RapidAPI, cliquez sur votre profil (en haut à droite)
2. Allez dans **"Security"** ou **"My Apps"**
3. Trouvez **"Application Key"** ou **"X-RapidAPI-Key"**
4. **Copiez votre clé complète** (elle devrait faire ~50 caractères)

### Étape 4 : Mettre la clé dans le code

Ouvrez `src/services/apiService.js` et remplacez la ligne 12 :

**AVANT :**
```javascript
const API_FOOTBALL_KEY = '8f1ae6fbb6msh1c7506d876c27f5p1b79a2jsn79a469b0';
```

**APRÈS (avec votre vraie clé) :**
```javascript
const API_FOOTBALL_KEY = 'votre_vraie_cle_rapidapi_ici_complete_50_caracteres';
```

### Étape 5 : Redémarrer React

Après avoir modifié le code :
1. Arrêtez React (Ctrl+C)
2. Relancez : `npm start`

## ✅ Vérification

Après avoir mis votre vraie clé, vous devriez voir dans la console :

```
✅✅✅ API-Football SUCCESS! Returned 15 match(es)
🎉 Using API-Football results - matches found!
```

Au lieu de :
```
❌ API-Football: 403 Forbidden
```

## 📝 Format d'une clé RapidAPI valide

- Longueur : ~50 caractères
- Format : `xxxxx...xxxxx` (alphanumérique)
- Exemple : `abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

## ⚠️ Important

- Ne partagez jamais votre clé API publiquement
- Ne commitez pas votre clé dans Git (elle est déjà dans le code maintenant, mais normalement on utilise .env)
- La clé est gratuite (100 requêtes/jour)

