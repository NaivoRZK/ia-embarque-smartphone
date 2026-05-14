# Tsaty — Assistant IA Local sur Mobile

**Tsaty** est une application mobile React Native qui exécute un modèle de langage (LLM) **directement sur le téléphone**, sans nécessiter de connexion internet. Idéal pour une utilisation hors ligne totale.

## 📱 Fonctionnalités

- 💬 **Chat IA local** avec Qwen2.5 0.5B (inférence 100% sur appareil via `llama.rn`)
- 🎤 **Reconnaissance vocale** (speech-to-text) pour dicter les messages
- 🔊 **Synthèse vocale** (text-to-speech) pour écouter les réponses
- 🛑 **Bouton stop** pour interrompre la lecture à tout moment
- ↺ **Réinitialisation** de la conversation
- 🔒 **100% hors ligne** — modèle embarqué dans l'APK

## 🧱 Technologies Utilisées

| Technologie | Rôle |
|------------|------|
| [React Native](https://reactnative.dev) 0.85.3 | Framework mobile cross-platform |
| [TypeScript](https://www.typescriptlang.org) | Langage typé |
| [llama.rn](https://github.com/mybigday/llama.rn) | Inference LLM locale (llama.cpp bindings) |
| [Qwen2.5 0.5B Q4_K_M](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF) | Modèle de langage embarqué (468 MB) |
| [NativeWind](https://www.nativewind.dev) v4 | Styling TailwindCSS pour React Native |
| [react-native-speech-recognition-kit](https://github.com/nicolai86/react-native-speech-recognition-kit) | Reconnaissance vocale |
| [react-native-tts](https://github.com/ak1394/react-native-tts) | Synthèse vocale |
| [react-native-fs](https://github.com/itinance/react-native-fs) | Gestion du stockage local |
| [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) | Animations performantes |

## 📦 Releases disponibles

Deux formats sont disponibles pour la distribution :

| Format | Taille | Usage |
|--------|--------|-------|
| **APK** (`.apk`) | ~607 MB | Installation directe sur Android |
| **AAB** (`.aab`) | ~531 MB | Publication sur le Google Play Store |

> Les deux intègrent le bundle JS et le modèle de langage Qwen2.5 0.5B.

### Téléchargement

🔗 [Télécharger la dernière release](https://github.com/NaivoRZK/ia-embarque-smartphone/releases/latest)

> **Note :** Si le lien est vide, créez une release depuis GitHub ou build vous-même (voir section Build).

### Installation

**APK :**
1. Téléchargez le fichier `.apk` sur votre téléphone Android
2. Ouvrez le fichier depuis le gestionnaire de fichiers
3. Autorisez l'installation depuis des sources inconnues si demandé
4. Lancez **Tsaty**

**AAB :**
- À utiliser exclusivement pour publication sur le Google Play Store
- Ne peut pas être installé directement sur un appareil

## 🚀 Installer le projet sur PC (pour développeurs)

### Prérequis

- Node.js >= 22.11.0
- React Native CLI (voir [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment))
- Android Studio (pour le build Android)
- Un appareil Android ou un émulateur

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/NaivoRZK/ia-embarque-smartphone.git
cd ia-embarque-smartphone

# 2. Installer les dépendances
npm install

# 3. (Optionnel) Embarquer le modèle dans les assets
# Télécharger Qwen2.5 0.5B Q4_K_M depuis Hugging Face :
# https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf
# Puis le placer dans :
mkdir -p android/app/src/main/assets/models
cp /chemin/vers/qwen2.5-0.5b-instruct-q4_k_m.gguf android/app/src/main/assets/models/

# 4. Lancer en mode développement
npm start        # Démarre Metro bundler
npm run android  # Build et installe sur l'appareil connecté

# 5. Build release

```bash
# Build APK (installation directe)
cd android && ./gradlew assembleRelease

# Build AAB (Google Play Store)
cd android && ./gradlew bundleRelease
```

Fichiers générés :
```
APK : android/app/build/outputs/apk/release/app-release.apk
AAB : android/app/build/outputs/bundle/release/app-release.aab
```

L'APK généré se trouve dans :
```
android/app/build/outputs/apk/release/app-release.apk
```

### Architecture du Projet

```
src/
├── entities/          # Types et interfaces (Message, ScreenState)
├── logique/
│   ├── config/        # Constantes de configuration
│   ├── hooks/         # Hooks React (useChat, useVoice)
│   └── services/      # Services métier (Llm, Voice, TTS, Model)
├── stockage/
│   └── repositories/  # Accès au stockage (ModelRepository)
└── ui/
    ├── components/    # Composants réutilisables
    ├── screens/       # Écrans de l'application
    └── theme/         # Thème et styles
```

## 📄 Licence

Projet privé — Tous droits réservés.
