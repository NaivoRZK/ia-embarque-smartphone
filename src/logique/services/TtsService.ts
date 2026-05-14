import Tts from 'react-native-tts';
import { TTS_LANG, TTS_RATE } from '../config/constants';

export class TtsService {
  init(): void {
    Tts.setDefaultLanguage(TTS_LANG);
    Tts.setDefaultRate(TTS_RATE);
  }

  speak(text: string): void {
    const clean = text.replace(/<[^>]*>/g, '');
    if (clean.trim()) {
      Tts.speak(clean);
    }
  }
}
