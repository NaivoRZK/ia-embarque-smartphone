# Tsaty — Assistant IA Local sur Mobile

**Tsaty** est une application mobile React Native qui execute un modele de langage (LLM) **directement sur l'appareil**, sans aucune connexion internet. 100% hors ligne, aucune donnee envoyee a l'exterieur.

## Fonctionnalites

- **Chat IA local** avec Qwen2.5 0.5B via llama.rn
- **Reconnaissance vocale** pour dicter les messages
- **Synthese vocale** pour ecouter les reponses
- **Bouton stop** pour interrompre la lecture
- **Reinitialisation** de la conversation

## Stack technique

React Native 0.85.3 • TypeScript • NativeWind • llama.rn • Qwen2.5 0.5B

## Fichiers de build

[Telecharger la derniere release](https://github.com/NaivoRZK/ia-embarque-smartphone/releases/latest)

| Fichier | Description |
|---------|-------------|
| `tsaty-release.apk` (~607 MB) | Installation directe sur Android |
| `tsaty-release.aab` (~531 MB) | Publication Google Play Store |

### Installation

1. Telechargez `tsaty-release.apk` depuis la release
2. Ouvrez le fichier sur votre appareil Android
3. Autorisez l'installation depuis des sources inconnues si necessaire
4. Lancez **Tsaty**

## Developpement

```bash
git clone https://github.com/NaivoRZK/ia-embarque-smartphone.git
cd ia-embarque-smartphone
npm install
npm start        # Metro bundler
npm run android  # Build & install
```
