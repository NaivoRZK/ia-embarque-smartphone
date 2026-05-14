import { useState, useRef, useCallback } from 'react';
import { VoiceService } from '../services/VoiceService';

export function useVoice(
  voiceService: VoiceService | null,
  onResult: (text: string) => void,
  isGenerationLocked: boolean,
) {
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const isListeningRef = useRef(false);

  const toggleMic = useCallback(async () => {
    if (isGenerationLocked || !voiceService) return;
    setVoiceError('');

    if (isListeningRef.current) {
      await voiceService.stop();
      isListeningRef.current = false;
      setIsListening(false);
    } else {
      const hasPerm = await voiceService.requestPermission();
      if (!hasPerm) {
        setVoiceError('Permission micro refusée');
        return;
      }

      isListeningRef.current = true;
      setIsListening(true);

      try {
        await voiceService.start();
      } catch (e: any) {
        isListeningRef.current = false;
        setIsListening(false);
        setVoiceError(e?.message || 'Erreur démarrage micro');
      }
    }
  }, [isGenerationLocked, voiceService]);

  const setupVoiceCallbacks = useCallback(() => {
    if (!voiceService) return;
    voiceService.setup({
      onStart: () => {
        setIsListening(true);
        setVoiceError('');
      },
      onEnd: () => {
        setIsListening(false);
        isListeningRef.current = false;
      },
      onResults: (text) => {
        onResult(text);
      },
      onPartialResults: (_text) => {},
      onError: (error) => {
        setIsListening(false);
        isListeningRef.current = false;
        setVoiceError(error);
      },
    });
  }, [voiceService, onResult]);

  return { isListening, voiceError, toggleMic, setupVoiceCallbacks, setVoiceError };
}
