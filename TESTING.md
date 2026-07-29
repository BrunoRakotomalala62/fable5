# Fable5 Pro - Guide de Test

## Vue d'ensemble

Fable5 Pro est une application web moderne de chat IA multi-modèles avec capacités avancées de modification d'image. Cette documentation couvre les tests des fonctionnalités clés.

## Fonctionnalités Testées

### 1. Interface Chat Multi-Modèles

**Modèles Disponibles:**
- GPT-4o (OpenAI)
- Claude 3 Opus (Anthropic)
- Gemini 2.0 Flash (Google)
- GPT-4 Turbo (OpenAI)

**Étapes de Test:**
1. Accédez à l'onglet "Chat"
2. Sélectionnez un modèle via les boutons en haut
3. Tapez un message et appuyez sur Entrée
4. Vérifiez que la réponse s'affiche en streaming

**Résultat Attendu:**
- Les messages utilisateur apparaissent à droite
- Les réponses IA apparaissent à gauche avec le logo du modèle
- Les réponses sont affichées progressivement (streaming)

### 2. Gestion des Conversations

**Étapes de Test:**
1. Créez plusieurs conversations en cliquant sur "Nouveau"
2. Vérifiez que chaque conversation est listée dans la sidebar
3. Cliquez sur une conversation pour la charger
4. Cliquez sur le bouton de suppression pour effacer une conversation

**Résultat Attendu:**
- Les conversations sont sauvegardées dans localStorage
- La liste se met à jour en temps réel
- Les conversations supprimées disparaissent

### 3. Éditeur d'Images - Mode Simple

**Étapes de Test:**
1. Accédez à l'onglet "Éditeur d'Images"
2. Sélectionnez "Mode Simple"
3. Téléchargez une image (PNG, JPG, ou WebP)
4. Décrivez les modifications (ex: "Changer la chemise en bleu")
5. Cliquez sur "Modifier l'image"

**Résultat Attendu:**
- L'image s'affiche en aperçu
- Un indicateur de chargement apparaît
- L'image modifiée s'affiche après traitement
- Un bouton de téléchargement est disponible

**Exemple de Prompts:**
- "Changer la couleur du ciel en rose"
- "Ajouter des lunettes de soleil"
- "Rendre l'image plus lumineuse"

### 4. Éditeur d'Images - Mode Multi-Images

**Étapes de Test:**
1. Sélectionnez "Mode Multi-Images"
2. Téléchargez 2-3 images
3. Décrivez la composition (ex: "Mettre la personne à côté du paysage")
4. Cliquez sur "Modifier l'image"

**Résultat Attendu:**
- Tous les aperçus d'images s'affichent
- L'image composée est générée
- Le résultat combine les éléments des images sources

**Exemple de Prompts:**
- "Mettre la personne de l'image 1 à côté du paysage de l'image 2"
- "Créer un collage avec les trois images"
- "Fusionner les deux images de manière créative"

### 5. Intégration Puter.js

**Vérification de l'API:**
- L'SDK Puter.js est chargé correctement (vérifiez la console)
- Les appels à `puter.ai.chat()` fonctionnent
- Les appels à `puter.ai.txt2img()` avec `input_images` fonctionnent

**Erreurs Possibles:**
- "Puter SDK not loaded" → Vérifiez que le script est chargé
- "Erreur d'authentification" → Connectez-vous à Puter
- "Quota dépassé" → Attendez avant de faire d'autres requêtes

## Architecture Technique

### Fichiers Clés

| Fichier | Description |
|---------|-------------|
| `client/src/pages/Home.tsx` | Page principale avec tabs Chat/Éditeur |
| `client/src/components/ChatInterface.tsx` | Interface de chat avec streaming |
| `client/src/components/ImageEditor.tsx` | Éditeur d'images single/multi |
| `client/src/components/Sidebar.tsx` | Gestion des conversations |
| `client/src/hooks/usePuterAI.ts` | Logique d'état et gestion des modèles |
| `client/src/lib/puter-types.ts` | Types TypeScript pour Puter.js |

### Flux de Données

**Chat:**
```
Utilisateur → Input → addMessage(user) → Puter.ai.chat() → 
updateMessage(ai) → Affichage streaming → Sauvegarde localStorage
```

**Image-to-Image:**
```
Upload Image → Base64 → Puter.ai.txt2img(prompt, input_images) → 
Image URL → Affichage → Téléchargement
```

## Checklist de Validation

- [x] Interface responsive (desktop/mobile)
- [x] Thème sombre avec accents dorés
- [x] Sélecteur de modèles IA
- [x] Chat avec streaming
- [x] Gestion des conversations
- [x] Éditeur d'images simple
- [x] Éditeur d'images multi
- [x] Persistance localStorage
- [x] Gestion des erreurs
- [x] Animations fluides

## Améliorations Futures

1. **Authentification Puter** - Intégrer la connexion utilisateur
2. **Historique des Images** - Galerie des images générées
3. **Partage** - Exporter conversations et images
4. **Modèles Personnalisés** - Permettre l'ajout de modèles custom
5. **Analyse d'Images** - Utiliser la vision pour analyser les uploads
6. **Édition Avancée** - Masques, sélections, ajustements précis

## Notes de Développement

### Puter.js API Utilisée

**Chat:**
```typescript
await puter.ai.chat(messages, {
  model: 'gpt-4o',
  stream: true
})
```

**Image-to-Image:**
```typescript
await puter.ai.txt2img(prompt, {
  provider: 'openai-image-generation',
  model: 'gpt-image-1',
  input_images: [dataUrl1, dataUrl2]
})
```

### Limitations Connues

1. Une seule image peut être attachée au chat (première image)
2. Max 3 images en mode multi-images
3. Pas de support pour les fichiers PDF en image editor
4. Pas de cache des images générées

## Support

Pour les problèmes:
1. Vérifiez la console du navigateur (F12)
2. Vérifiez que Puter.js est chargé
3. Vérifiez votre connexion internet
4. Consultez la documentation Puter: https://docs.puter.com/
