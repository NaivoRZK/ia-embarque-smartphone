# Tsaty — Assistant IA Local sur Mobile

**Tsaty** est une application mobile React Native qui exécute un modèle de langage (LLM) **directement sur l'appareil**, sans aucune dépendance réseau. Idéal pour une utilisation hors ligne totale, confidentialité des données garantie.

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---------------|-------------|
| 💬 **Chat IA local** | Inférence LLM 100% sur l'appareil via `llama.rn` (Qwen2.5 0.5B) |
| 🎤 **Reconnaissance vocale** | Dictez vos messages par la voix |
| 🔊 **Synthèse vocale** | Écoutez les réponses de l'assistant |
| 🛑 **Contrôle de lecture** | Bouton stop (■) pour interrompre la synthèse vocale à tout moment |
| ↺ **Réinitialisation** | Effacez la conversation d'un seul geste |
| 🔒 **100% hors ligne** | Modèle embarqué, zéro requête réseau |
| 📱 **Autonome** | Aucun serveur, aucun backend requis |

---

## 🧱 Stack Technique

### Technologies principales

| Technologie | Version | Rôle |
|-------------|---------|------|
| [React Native](https://reactnative.dev) | 0.85.3 | Framework mobile cross-platform (Fabric) |
| [TypeScript](https://www.typescriptlang.org) | ^5.8 | Langage typé |
| [NativeWind](https://www.nativewind.dev) | 4.2 | Styling TailwindCSS |
| [llama.rn](https://github.com/mybigday/llama.rn) | 0.12 | Bindings React Native pour llama.cpp |
| [Qwen2.5 0.5B](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF) | Q4_K_M | Modèle de langage embarqué (468 MB) |

### Librairies support

| Librairie | Rôle |
|-----------|------|
| `react-native-speech-recognition-kit` | Reconnaissance vocale (speech-to-text) |
| `react-native-tts` | Synthèse vocale (text-to-speech) |
| `react-native-fs` | Gestion des fichiers (stockage du modèle) |
| `react-native-reanimated` | Animations fluides |
| `react-native-safe-area-context` | Gestion des safe areas |
| `react-native-worklets` | Threading natif pour performances |

---

## 🏗 Architecture & Flux

### Architecture en couches

```
src/
├── entities/              # Types et interfaces du domaine
│   ├── Message.ts         # Interface du message (id, text, role, timestamp)
│   └── ScreenState.ts     # États de l'écran (idle, downloading, loading, ready, error)
│
├── logique/               # Logique métier
│   ├── config/
│   │   └── constants.ts   # Configuration (modèle, LLM, TTS, voix)
│   ├── services/          # Services métier (classes)
│   │   ├── LlmService.ts  # Interface avec llama.rn (init, generate, cancel)
│   │   ├── ModelService.ts # Gestion du cycle de vie du modèle (download/asset/init)
│   │   ├── VoiceService.ts # Reconnaissance vocale (permissions, écoute)
│   │   └── TtsService.ts  # Synthèse vocale (speak, stop, Promise-based)
│   └── hooks/             # Hooks React (pont entre services et UI)
│       ├── useChat.ts     # État du chat, envoi, génération, lecture TTS
│       └── useVoice.ts    # État du micro, écoute, permissions
│
├── stockage/              # Accès aux données persistantes
│   └── repositories/
│       └── ModelRepository.ts  # Opérations fichier (download, copy, existence)
│
└── ui/                    # Interface utilisateur
    ├── components/        # Composants réutilisables
    │   ├── ChatInput.tsx  # Input + micro + stop/reset/send
    │   ├── MessageBubble.tsx # Bulle de message (user/assistant)
    │   ├── MessageList.tsx   # FlatList des messages
    │   ├── Header.tsx        # Barre de titre
    │   └── SetupView.tsx     # Écran de téléchargement/chargement/erreur
    ├── screens/
    │   └── ChatScreen.tsx # Écran principal (orchestrateur)
    └── theme/
```

### Flux détaillés

#### 1. Flux de démarrage (Model Loading)

```
App launch
  │
  ├─ ModelService.initialize()
  │    │
  │    ├─ ensureDir() ──────────────── Crée le dossier models/
  │    │
  │    ├─ modelExists() ?
  │    │    ├─ OUI → loadModel() ────── initLlama() → ready
  │    │    └─ NON →
  │    │         ├─ assetExists() ?
  │    │         │    ├─ OUI → copyFromAsset() → loadModel() → ready
  │    │         │    └─ NON → downloadModel() → loadModel() → ready
  │    │
  │    └─ ScreenState: idle → downloading/loading → ready/error
  │
  └─ ChatScreen affiche :
       ├─ [idle]          → SetupView (vide)
       ├─ [downloading]  → DownloadView (progression)
       ├─ [loading]      → LoadingView (progression)
       ├─ [ready]        → Chat UI (messages + input)
       └─ [error]        → ErrorView (message + bouton réessayer)
```

#### 2. Flux d'envoi de message (Chat)

```
Utilisateur tape + ↑ (ou dicte)
  │
  ├─ handleSend() / handleVoiceResult()
  │    │
  │    ├─ doSend(text)
  │    │    │
  │    │    ├─ 1. Ajoute le message user à la liste
  │    │    ├─ 2. Crée un message assistant vide
  │    │    ├─ 3. lockedRef = true, setIsGenerating(true)
  │    │    │
  │    │    ├─ 4. llm.generate(history, onToken)
  │    │    │    │
  │    │    │    ├─ llama.rn génère token par token
  │    │    │    ├─ onToken(partial) → met à jour le message assistant
  │    │    │    └─ UI: spinner ██ dans le bouton d'envoi
  │    │    │
  │    │    ├─ 5. Génération terminée → fullResponse
  │    │    │    ├─ setIsGenerating(false)
  │    │    │    └─ setIsSpeaking(true)
  │    │    │
  │    │    ├─ 6. tts.speak(fullResponse)
  │    │    │    ├─ Attend la fin de la synthèse (Promise)
  │    │    │    └─ UI: bouton stop ■ (rouge) dans l'input
  │    │    │
  │    │    └─ 7. TTS terminé → setIsSpeaking(false), lockedRef = false
  │    │         UI: retour au bouton envoi ↑
  │    │
  │    └─ En cas d'erreur → affiche "Erreur: ..." dans le message assistant
  │
  └─ États UI :
       [Écriture] ██ spinner  →  [Lecture] ■ stop  →  [Repos] ↑ envoi
```

#### 3. Flux vocal (Voice)

```
Appui sur 🎤
  │
  ├─ handleMicPress()
  │    │
  │    ├─ Si locked (génération en cours) ?
  │    │    └─ OUI → cancelGeneration() + stop TTS + arrête écoute
  │    │
  │    ├─ Si déjà en écoute ?
  │    │    └─ OUI → stopListening()
  │    │
  │    └─ Sinon →
  │         ├─ requestPermission() → RECORD_AUDIO
  │         ├─ startListening()
  │         └─ UI: 🎤 → icône d'onde sonore
  │
  └─ Résultat vocal reçu (onResults)
       └─ doSend(text) → envoie directement le texte (sans passer par l'input)
```

#### 4. Flux d'annulation (Stop)

```
Appui sur ■ (stop) ou 🎤 (pendant génération)
  │
  ├─ cancelGeneration()
  │    │
  │    ├─ llm.cancel()     → _cancelled = true (callback ignore les tokens)
  │    ├─ tts.stop()       → stop immédiat de la synthèse
  │    ├─ setIsGenerating(false)
  │    ├─ setIsSpeaking(false)
  │    └─ lockedRef = false → UI débloquée immédiatement
  │
  └─ Résultat : utilisateur peut re-écrire, ré-enregistrer ou réinitialiser
```

---

## 📦 Builds & Distribution

### Formats disponibles

| Format | Taille | Usage | Commande |
|--------|--------|-------|----------|
| **APK** (`.apk`) | ~607 MB | Installation directe sur Android | `./gradlew assembleRelease` |
| **AAB** (`.aab`) | ~531 MB | Publication Google Play Store | `./gradlew bundleRelease` |

> Les deux intègrent le bundle JS et le modèle Qwen2.5 0.5B (468 MB).

### Téléchargement

🔗 [Voir les releases sur GitHub](https://github.com/NaivoRZK/ia-embarque-smartphone/releases/latest)

> Créez une release depuis GitHub ou build manuellement (voir ci-dessous).

### Installation de l'APK

1. Téléchargez le fichier `.apk` sur votre appareil Android
2. Ouvrez-le depuis le gestionnaire de fichiers
3. Autorisez l'installation depuis des sources inconnues si nécessaire
4. Lancez **Tsaty**

---

## 🚀 Développement

### Prérequis

- Node.js ≥ 22.11.0
- [React Native CLI](https://reactnative.dev/docs/set-up-your-environment)
- Android Studio (NDK, SDK)
- Appareil Android avec débogage USB activé (ou émulateur)

### Installation

```bash
# Cloner
git clone https://github.com/NaivoRZK/ia-embarque-smartphone.git
cd ia-embarque-smartphone

# Dépendances
npm install

# (Optionnel) Embarquer le modèle dans les assets pour build offline
mkdir -p android/app/src/main/assets/models
# Télécharger : https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf
cp /chemin/vers/qwen2.5-0.5b-instruct-q4_k_m.gguf android/app/src/main/assets/models/
```

### Lancement (dev)

```bash
# Terminal 1 : Metro bundler
npm start

# Terminal 2 : Build & install sur l'appareil
npm run android
```

### Build release

```bash
cd android

# APK (installation directe)
./gradlew assembleRelease

# AAB (Google Play)
./gradlew bundleRelease
```

Fichiers générés :
```
📦 android/app/build/outputs/apk/release/app-release.apk
📦 android/app/build/outputs/bundle/release/app-release.aab
```
