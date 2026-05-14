import { Platform, PermissionsAndroid, TurboModuleRegistry, NativeModules, NativeEventEmitter } from 'react-native';
import { VOICE_LOCALE } from '../config/constants';

export interface VoiceCallbacks {
  onStart: () => void;
  onEnd: () => void;
  onResults: (text: string) => void;
  onPartialResults: (text: string) => void;
  onError: (error: string) => void;
}

const EVENTS = {
  START: 'onSpeechStart',
  END: 'onSpeechEnd',
  RESULTS: 'onSpeechResults',
  PARTIAL_RESULTS: 'onSpeechPartialResults',
  ERROR: 'onSpeechError',
} as const;

function getNativeModule(): any {
  try {
    const tm = TurboModuleRegistry?.get('SpeechRecognition');
    if (tm) return tm;
  } catch {}
  return (NativeModules as any).SpeechRecognition;
}

const NativeSpeech = getNativeModule();

export class VoiceService {
  private callbacks: VoiceCallbacks | null = null;
  private emitter: NativeEventEmitter | null = null;
  private subscriptions: Array<{ remove: () => void }> = [];

  readonly isAvailable = !!NativeSpeech;

  setup(callbacks: VoiceCallbacks): void {
    this.cleanup();
    this.callbacks = callbacks;
    if (!NativeSpeech) return;

    this.emitter = new NativeEventEmitter(NativeSpeech);

    const addSub = (event: string, handler: (...args: any[]) => void) => {
      const sub = this.emitter!.addListener(event, handler);
      this.subscriptions.push(sub);
    };

    addSub(EVENTS.START, () => this.callbacks?.onStart());
    addSub(EVENTS.END, () => this.callbacks?.onEnd());
    addSub(EVENTS.RESULTS, (event: any) => {
      if (event?.value) this.callbacks?.onResults(event.value);
    });
    addSub(EVENTS.PARTIAL_RESULTS, (event: any) => {
      if (event?.value) this.callbacks?.onPartialResults(event.value);
    });
    addSub(EVENTS.ERROR, (event: any) => {
      this.callbacks?.onError(event?.message || 'Erreur de reconnaissance');
    });

    if (NativeSpeech.setRecognitionLanguage) {
      NativeSpeech.setRecognitionLanguage(VOICE_LOCALE).catch(() => {});
    }
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
    if (!NativeSpeech) {
      throw new Error('Reconnaissance vocale non disponible');
    }
    await NativeSpeech.startListening();
  }

  async stop(): Promise<void> {
    if (!NativeSpeech) return;
    await NativeSpeech.stopListening();
  }

  async destroy(): Promise<void> {
    this.cleanup();
    if (NativeSpeech?.destroy) {
      try {
        await NativeSpeech.destroy();
      } catch {}
    }
  }

  private cleanup(): void {
    this.subscriptions.forEach((s) => s.remove());
    this.subscriptions = [];
    this.callbacks = null;
  }
}
