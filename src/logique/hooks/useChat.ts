import { useState, useRef, useCallback } from 'react';
import type { Message } from '../../entities/Message';
import { LlmService } from '../services/LlmService';
import { TtsService } from '../services/TtsService';
import { GREETING_MESSAGE } from '../config/constants';

export function useChat(llm: LlmService | null, tts: TtsService | null) {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'greeting',
      text: GREETING_MESSAGE,
      role: 'assistant',
      timestamp: Date.now(),
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesRef = useRef<Message[]>([]);
  const lockedRef = useRef(false);

  messagesRef.current = messages;

  const isLocked = isGenerating || isSpeaking;

  const resetMessages = useCallback(() => {
    setMessages([
      {
        id: 'greeting',
        text: GREETING_MESSAGE,
        role: 'assistant',
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const doSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || lockedRef.current || !llm) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        text: trimmed,
        role: 'user',
        timestamp: Date.now(),
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '',
        role: 'assistant',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsGenerating(true);
      lockedRef.current = true;

      try {
        const history = [...messagesRef.current, userMessage];
        const fullResponse = await llm.generate(history, (partial) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === 'assistant') {
              updated[updated.length - 1] = { ...last, text: partial };
            }
            return updated;
          });
        });

        setIsGenerating(false);

        if (fullResponse.trim() && tts) {
          setIsSpeaking(true);
          await tts.speak(fullResponse);
          setIsSpeaking(false);
        }
      } catch (err: any) {
        setIsGenerating(false);
        setIsSpeaking(false);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === 'assistant') {
            updated[updated.length - 1] = {
              ...last,
              text: `Erreur: ${err.message}`,
            };
          }
          return updated;
        });
      } finally {
        setIsGenerating(false);
        setIsSpeaking(false);
        lockedRef.current = false;
      }
    },
    [llm, tts],
  );

  const cancelGeneration = useCallback(() => {
    if (llm) llm.cancel();
    if (tts) tts.stop();
    setIsGenerating(false);
    setIsSpeaking(false);
    lockedRef.current = false;
  }, [llm, tts]);

  return { messages, isGenerating, isSpeaking, isLocked, doSend, resetMessages, cancelGeneration };
}
