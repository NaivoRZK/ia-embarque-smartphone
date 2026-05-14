import { renderHook, act } from '@testing-library/react-hooks';
import { useChat } from '../../../src/logique/hooks/useChat';
import { LlmService } from '../../../src/logique/services/LlmService';
import { TtsService } from '../../../src/logique/services/TtsService';

jest.mock('../../../src/logique/services/LlmService');
jest.mock('../../../src/logique/services/TtsService');

describe('useChat', () => {
  let llm: jest.Mocked<LlmService>;
  let tts: jest.Mocked<TtsService>;

  beforeEach(() => {
    jest.clearAllMocks();
    llm = new LlmService() as jest.Mocked<LlmService>;
    tts = new TtsService() as jest.Mocked<TtsService>;

    llm.generate.mockResolvedValue('Réponse');
  });

  it('starts with a greeting message', () => {
    const { result } = renderHook(() => useChat(llm, tts));

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('assistant');
    expect(result.current.messages[0].text).toContain('Bonjour');
  });

  it('starts not generating', () => {
    const { result } = renderHook(() => useChat(llm, tts));

    expect(result.current.isGenerating).toBe(false);
  });

  it('adds user and assistant messages on send', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useChat(llm, tts));

    await act(async () => {
      result.current.doSend('Salut');
    });

    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[1].role).toBe('user');
    expect(result.current.messages[1].text).toBe('Salut');
    expect(result.current.messages[2].role).toBe('assistant');
  });

  it('does not send empty text', async () => {
    const { result } = renderHook(() => useChat(llm, tts));

    await act(async () => {
      result.current.doSend('   ');
    });

    expect(result.current.messages).toHaveLength(1);
  });

  it('does not send when llm is null', async () => {
    const { result } = renderHook(() => useChat(null, tts));

    await act(async () => {
      result.current.doSend('Hello');
    });

    expect(result.current.messages).toHaveLength(1);
  });

  it('returns to not generating after send completes', async () => {
    const { result } = renderHook(() => useChat(llm, tts));

    await act(async () => {
      await result.current.doSend('Hi');
    });

    expect(result.current.isGenerating).toBe(false);
  });

  it('resets messages', () => {
    const { result } = renderHook(() => useChat(llm, tts));

    act(() => {
      result.current.resetMessages();
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].text).toContain('Bonjour');
  });

  it('speaks response with TTS', async () => {
    const { result } = renderHook(() => useChat(llm, tts));

    await act(async () => {
      await result.current.doSend('Hello');
    });

    expect(tts.speak).toHaveBeenCalled();
  });

  it('handles LLM error gracefully', async () => {
    llm.generate.mockRejectedValue(new Error('Erreur test'));

    const { result } = renderHook(() => useChat(llm, tts));

    await act(async () => {
      await result.current.doSend('Hello');
    });

    const lastMessage = result.current.messages[result.current.messages.length - 1];
    expect(lastMessage.text).toContain('Erreur');
    expect(result.current.isGenerating).toBe(false);
  });
});
