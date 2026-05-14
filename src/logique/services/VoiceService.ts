import Voice from '@react-native-community/voice';
import { Platform, PermissionsAndroid } from 'react-native';
import { VOICE_LOCALE } from '../config/constants';

export interface VoiceCallbacks {
  onStart: () => void;
  onEnd: () => void;
  onResults: (text: string) => void;
  onPartialResults: (text: string) => void;
  onError: (error: string) => void;
}

export class VoiceService {
  private callbacks: VoiceCallbacks | null = null;

  setup(callbacks: VoiceCallbacks): void {
    this.callbacks = callbacks;

    Voice.onSpeechStart = () => this.callbacks?.onStart();
    Voice.onSpeechEnd = () => this.callbacks?.onEnd();

    Voice.onSpeechResults = (e) => {
      if (e.value?.[0]) {
        this.callbacks?.onResults(e.value[0]);
      }
    };

    Voice.onSpeechPartialResults = (e) => {
      if (e.value?.[0]) {
        this.callbacks?.onPartialResults(e.value[0]);
      }
    };

    Voice.onSpeechError = (e) => {
      this.callbacks?.onError(e.error?.message || 'Erreur de reconnaissance');
    };
  }

  async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch {
        return false;
      }
    }
    return true;
  }

  async start(): Promise<void> {
    await Voice.start(VOICE_LOCALE, { REQUEST_PERMISSIONS_AUTO: false });
  }

  async stop(): Promise<void> {
    await Voice.stop();
  }

  async destroy(): Promise<void> {
    await Voice.destroy().then(Voice.removeAllListeners);
  }
}
