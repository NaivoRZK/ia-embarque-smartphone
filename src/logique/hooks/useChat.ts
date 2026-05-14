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
  const messagesRef = useRef<Message[]>([]);
  const isGeneratingRef = useRef(false);

  messagesRef.current = messages;

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
      if (!trimmed || isGeneratingRef.current || !llm) return;

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
      isGeneratingRef.current = true;

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

        if (fullResponse.trim() && tts) {
          tts.speak(fullResponse);
        }
      } catch (err: any) {
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
        isGeneratingRef.current = false;
      }
    },
    [llm, tts],
  );

  return { messages, isGenerating, doSend, resetMessages };
}
