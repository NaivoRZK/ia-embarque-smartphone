import Tts, { TtsEvent } from 'react-native-tts';
import { TTS_LANG, TTS_RATE } from '../config/constants';

export class TtsService {
  init(): void {
    Tts.setDefaultLanguage(TTS_LANG);
    Tts.setDefaultRate(TTS_RATE);
  }

  speak(text: string): Promise<void> {
    const clean = text.replace(/<[^>]*>/g, '');
    if (!clean.trim()) return Promise.resolve();
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        finishSub.remove();
        cancelledSub.remove();
        resolve();
      };
      const finishSub = Tts.addEventListener('finish', finish);
      const cancelledSub = Tts.addEventListener('cancelled', finish);
      Tts.speak(clean);
    });
  }

  stop(): void {
    Tts.stop();
  }
}
