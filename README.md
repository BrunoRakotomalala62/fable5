# Fable5 Pro - Chat & Image AI Studio

Une application web moderne et professionnelle pour le chat multi-modèles IA avec capacités avancées de modification d'image via l'API Puter.

## 🎯 Caractéristiques

### Chat Multi-Modèles
- **4 modèles IA disponibles**: GPT-4o, Claude 3 Opus, Gemini 2.0 Flash, GPT-4 Turbo
- **Streaming en temps réel**: Les réponses s'affichent progressivement
- **Support des images**: Attachez des images pour l'analyse IA
- **Historique persistant**: Toutes les conversations sont sauvegardées

### Éditeur d'Images IA
- **Mode Simple**: Modifiez une seule image (changement de couleurs, ajout d'éléments, style)
- **Mode Multi-Images**: Fusionnez ou composez 2-3 images selon vos instructions
- **Aperçu en temps réel**: Visualisez les images avant/après
- **Téléchargement direct**: Récupérez vos images modifiées

### Interface Professionnelle
- **Design Premium**: Thème sombre avec accents dorés
- **Responsive**: Fonctionne sur desktop, tablette et mobile
- **Animations Fluides**: Transitions et interactions polies
- **Gestion des Conversations**: Créez, basculez et supprimez des conversations

## 🚀 Démarrage Rapide

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/BrunoRakotomalala62/fable5.git
cd fable5

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev
```

L'application sera disponible à `http://localhost:3000`

### Configuration

Aucune configuration requise! L'application utilise l'API Puter.js qui gère l'authentification automatiquement.

## 📚 Architecture

### Stack Technologique
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Routing**: Wouter
- **AI API**: Puter.js SDK
- **State Management**: React Hooks + localStorage

### Structure des Fichiers

```
client/
├── src/
│   ├── pages/
│   │   ├── Home.tsx              # Page principale avec tabs
│   │   └── NotFound.tsx
│   ├── components/
│   │   ├── ChatInterface.tsx      # Interface de chat
│   │   ├── ImageEditor.tsx        # Éditeur d'images
│   │   ├── Sidebar.tsx            # Gestion des conversations
│   │   └── ui/                    # Composants shadcn/ui
│   ├── hooks/
│   │   ├── usePuterAI.ts          # Logique IA et état
│   │   └── ...
│   ├── lib/
│   │   ├── puter-types.ts         # Types TypeScript
│   │   └── utils.ts
│   ├── App.tsx                    # Composant racine
│   ├── main.tsx                   # Point d'entrée
│   └── index.css                  # Styles globaux
├── index.html
└── public/
```

## 🎨 Design System

### Couleurs
- **Fond**: `#0a0a0f` (noir profond)
- **Accent**: `#b8860b` (or)
- **Secondaire**: `#252535` (gris-bleu)
- **Texte**: `#f2f2f7` (blanc cassé)

### Typographie
- **Display**: Poppins (700)
- **Body**: Inter (400/500/600)
- **Mono**: JetBrains Mono (400)

### Composants Clés
- **Message Bubbles**: Utilisateur (secondaire), IA (card avec bordure accent)
- **Buttons**: Accent pour les actions principales, outline pour les secondaires
- **Cards**: Fond card avec bordure subtle
- **Animations**: Ease-out smooth (0.23, 1, 0.32, 1)

## 🔌 Intégration Puter.js

### Chat API
```typescript
const response = await puter.ai.chat(messages, {
  model: 'gpt-4o',
  stream: true
});

for await (const part of response) {
  console.log(part.text);
}
```

### Image-to-Image API
```typescript
const result = await puter.ai.txt2img(prompt, {
  provider: 'openai-image-generation',
  model: 'gpt-image-1',
  input_images: [base64Image1, base64Image2]
});

console.log(result.image_url);
```

## 📖 Utilisation

### Chat
1. Sélectionnez un modèle via les boutons en haut
2. Tapez votre message
3. Optionnel: attachez une image avec le bouton 📎
4. Appuyez sur Entrée ou cliquez sur l'icône d'envoi

### Modification d'Images
1. Accédez à l'onglet "Éditeur d'Images"
2. Choisissez Mode Simple ou Multi-Images
3. Téléchargez vos images
4. Décrivez les modifications souhaitées
5. Cliquez sur "Modifier l'image"
6. Téléchargez le résultat

## 🧪 Tests

Voir [TESTING.md](./TESTING.md) pour un guide complet de test des fonctionnalités.

### Checklist Rapide
- [x] Chat multi-modèles fonctionnel
- [x] Streaming des réponses
- [x] Éditeur d'images simple
- [x] Éditeur d'images multi
- [x] Persistance des conversations
- [x] Gestion des erreurs
- [x] Interface responsive

## 🛠️ Développement

### Scripts Disponibles

```bash
# Développement
pnpm dev

# Build pour production
pnpm build

# Vérification TypeScript
pnpm check

# Formatage du code
pnpm format
```

### Dépendances Principales
- `react@19` - Framework UI
- `tailwindcss@4` - Styling
- `shadcn/ui` - Composants UI
- `wouter@3` - Routing léger
- `sonner` - Notifications toast
- `lucide-react` - Icônes
- `streamdown` - Rendu Markdown

## 📝 Modèles Disponibles

| Modèle | Provider | Vision | Latence |
|--------|----------|--------|---------|
| GPT-4o | OpenAI | ✅ | Rapide |
| Claude 3 Opus | Anthropic | ✅ | Moyen |
| Gemini 2.0 Flash | Google | ✅ | Très rapide |
| GPT-4 Turbo | OpenAI | ✅ | Moyen |

## 🚀 Déploiement

### Manus Platform
```bash
# Créer un checkpoint
git add .
git commit -m "Version 1.0"

# Publier via l'UI Manus
# Cliquez sur le bouton Publish dans le Management UI
```

### Autres Plateformes
```bash
# Build statique
pnpm build

# Déployer le dossier dist/
# Vercel, Netlify, GitHub Pages, etc.
```

## 🐛 Dépannage

### "Puter SDK not loaded"
- Vérifiez que le script `https://js.puter.com/v2/` est chargé
- Vérifiez la console du navigateur (F12)

### "Erreur d'authentification"
- Connectez-vous à votre compte Puter
- Vérifiez votre connexion internet

### "Quota dépassé"
- Attendez avant de faire d'autres requêtes
- Vérifiez votre limite d'utilisation Puter

## 📚 Ressources

- [Documentation Puter.js](https://docs.puter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Documentation](https://react.dev/)

## 📄 Licence

MIT - Voir LICENSE pour les détails

## 👨‍💻 Auteur

Fable5 Pro - Chat & Image AI Studio
Créé avec ❤️ pour les créatifs et les développeurs

## 🤝 Contribution

Les contributions sont bienvenues! Veuillez:
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📞 Support

Pour les problèmes ou suggestions:
- Ouvrez une issue sur GitHub
- Consultez la documentation Puter
- Vérifiez le guide de test [TESTING.md](./TESTING.md)
