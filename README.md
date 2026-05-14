# Tsaty — Assistant IA Local sur Mobile

**Tsaty** est une application mobile React Native qui exécute un modèle de langage (LLM) **directement sur l'appareil**, sans aucune dépendance réseau. Idéal pour une utilisation hors ligne totale, confidentialité des données garantie.

---

## Fonctionnalites

| Fonctionnalite | Description |
|---------------|-------------|
| **Chat IA local** | Inférence LLM 100% sur l'appareil via `llama.rn` (Qwen2.5 0.5B) |
| **Reconnaissance vocale** | Dictez vos messages par la voix |
| **Synthese vocale** | Ecoutez les reponses de l'assistant |
| **Controle de lecture** | Bouton stop (■) pour interrompre la synthese vocale a tout moment |
| **Reinitialisation** | Effacez la conversation d'un seul geste |
| **100% hors ligne** | Modele embarque, zero requete reseau |
| **Autonome** | Aucun serveur, aucun backend requis |

---

## Stack Technique

### Technologies principales

| Technologie | Version | Role |
|-------------|---------|------|
| [React Native](https://reactnative.dev) | 0.85.3 | Framework mobile cross-platform (Fabric) |
| [TypeScript](https://www.typescriptlang.org) | ^5.8 | Langage type |
| [NativeWind](https://www.nativewind.dev) | 4.2 | Styling TailwindCSS |
| [llama.rn](https://github.com/mybigday/llama.rn) | 0.12 | Bindings React Native pour llama.cpp |
| [Qwen2.5 0.5B](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF) | Q4_K_M | Modele de langage embarque (468 MB) |

### Librairies support

| Librairie | Role |
|-----------|------|
| `react-native-speech-recognition-kit` | Reconnaissance vocale (speech-to-text) |
| `react-native-tts` | Synthese vocale (text-to-speech) |
| `react-native-fs` | Gestion des fichiers (stockage du modele) |
| `react-native-reanimated` | Animations fluides |
| `react-native-safe-area-context` | Gestion des safe areas |
| `react-native-worklets` | Threading natif pour performances |

---

## Architecture & Flux

### Architecture en couches

```
src/
├── entities/              # Types et interfaces du domaine
│   ├── Message.ts         # Interface du message (id, text, role, timestamp)
│   └── ScreenState.ts     # Etats de l'ecran (idle, downloading, loading, ready, error)
│
├── logique/               # Logique metier
│   ├── config/
│   │   └── constants.ts   # Configuration (modele, LLM, TTS, voix)
│   ├── services/          # Services metier (classes)
│   │   ├── LlmService.ts  # Interface avec llama.rn (init, generate, cancel)
│   │   ├── ModelService.ts # Gestion du cycle de vie du modele (download/asset/init)
│   │   ├── VoiceService.ts # Reconnaissance vocale (permissions, ecoute)
│   │   └── TtsService.ts  # Synthese vocale (speak, stop, Promise-based)
│   └── hooks/             # Hooks React (pont entre services et UI)
│       ├── useChat.ts     # Etat du chat, envoi, generation, lecture TTS
│       └── useVoice.ts    # Etat du micro, ecoute, permissions
│
├── stockage/              # Acces aux donnees persistantes
│   └── repositories/
│       └── ModelRepository.ts  # Operations fichier (download, copy, existence)
│
└── ui/                    # Interface utilisateur
    ├── components/        # Composants reutilisables
    │   ├── ChatInput.tsx  # Input + micro + stop/reset/send
    │   ├── MessageBubble.tsx # Bulle de message (user/assistant)
    │   ├── MessageList.tsx   # FlatList des messages
    │   ├── Header.tsx        # Barre de titre
    │   └── SetupView.tsx     # Ecran de telechargement/chargement/erreur
    ├── screens/
    │   └── ChatScreen.tsx # Ecran principal (orchestrateur)
    └── theme/
```

### Flux detailles

#### 1. Flux de demarrage (Model Loading)

```
App launch
  │
  ├─ ModelService.initialize()
  │    │
  │    ├─ ensureDir() ──────────────── Cree le dossier models/
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
       └─ [error]        → ErrorView (message + bouton reessayer)
```

#### 2. Flux d'envoi de message (Chat)

```
Utilisateur tape + ↑ (ou dicte)
  │
  ├─ handleSend() / handleVoiceResult()
  │    │
  │    ├─ doSend(text)
  │    │    │
  │    │    ├─ 1. Ajoute le message user a la liste
  │    │    ├─ 2. Cree un message assistant vide
  │    │    ├─ 3. lockedRef = true, setIsGenerating(true)
  │    │    │
  │    │    ├─ 4. llm.generate(history, onToken)
  │    │    │    │
  │    │    │    ├─ llama.rn genere token par token
  │    │    │    ├─ onToken(partial) → met a jour le message assistant
  │    │    │    └─ UI: spinner ██ dans le bouton d'envoi
  │    │    │
  │    │    ├─ 5. Generation terminee → fullResponse
  │    │    │    ├─ setIsGenerating(false)
  │    │    │    └─ setIsSpeaking(true)
  │    │    │
  │    │    ├─ 6. tts.speak(fullResponse)
  │    │    │    ├─ Attend la fin de la synthese (Promise)
  │    │    │    └─ UI: bouton stop ■ (rouge) dans l'input
  │    │    │
  │    │    └─ 7. TTS termine → setIsSpeaking(false), lockedRef = false
  │    │         UI: retour au bouton envoi ↑
  │    │
  │    └─ En cas d'erreur → affiche "Erreur: ..." dans le message assistant
  │
  └─ Etats UI :
       [Ecriture] ██ spinner  →  [Lecture] ■ stop  →  [Repos] ↑ envoi
```

#### 3. Flux vocal (Voice)

```
Appui sur micro
  │
  ├─ handleMicPress()
  │    │
  │    ├─ Si locked (generation en cours) ?
  │    │    └─ OUI → cancelGeneration() + stop TTS + arrete ecoute
  │    │
  │    ├─ Si deja en ecoute ?
  │    │    └─ OUI → stopListening()
  │    │
  │    └─ Sinon →
  │         ├─ requestPermission() → RECORD_AUDIO
  │         ├─ startListening()
  │         └─ UI: onde sonore
  │
  └─ Resultat vocal recu (onResults)
       └─ doSend(text) → envoie directement le texte (sans passer par l'input)
```

#### 4. Flux d'annulation (Stop)

```
Appui sur ■ (stop) ou micro (pendant generation)
  │
  ├─ cancelGeneration()
  │    │
  │    ├─ llm.cancel()     → _cancelled = true (callback ignore les tokens)
  │    ├─ tts.stop()       → stop immediat de la synthese
  │    ├─ setIsGenerating(false)
  │    ├─ setIsSpeaking(false)
  │    └─ lockedRef = false → UI debloquee immediatement
  │
  └─ Resultat : utilisateur peut re-ecrire, re-enregistrer ou reinialiser
```

---

## Builds & Distribution

### Formats disponibles

| Format | Taille | Usage | Commande |
|--------|--------|-------|----------|
| **APK** (`.apk`) | ~607 MB | Installation directe sur Android | `./gradlew assembleRelease` |
| **AAB** (`.aab`) | ~531 MB | Publication Google Play Store | `./gradlew bundleRelease` |

> Les deux integrent le bundle JS et le modele Qwen2.5 0.5B (468 MB).

### Telechargement

[Voir les releases sur GitHub](https://github.com/NaivoRZK/ia-embarque-smartphone/releases/latest)

> Creez une release depuis GitHub ou build manuellement (voir ci-dessous).

### Installation de l'APK

1. Telechargez le fichier `.apk` sur votre appareil Android
2. Ouvrez-le depuis le gestionnaire de fichiers
3. Autorisez l'installation depuis des sources inconnues si necessaire
4. Lancez **Tsaty**

---

## Developpement

### Pre-requis

- Node.js >= 22.11.0
- [React Native CLI](https://reactnative.dev/docs/set-up-your-environment)
- Android Studio (NDK, SDK)
- Appareil Android avec debogage USB active (ou emulateur)

### Installation

```bash
# Cloner
git clone https://github.com/NaivoRZK/ia-embarque-smartphone.git
cd ia-embarque-smartphone

# Dependances
npm install

# (Optionnel) Embarquer le modele dans les assets pour build offline
mkdir -p android/app/src/main/assets/models
# Telecharger : https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf
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

Fichiers generes :
```
android/app/build/outputs/apk/release/app-release.apk
android/app/build/outputs/bundle/release/app-release.aab
```
