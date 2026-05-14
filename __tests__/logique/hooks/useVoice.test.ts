import { renderHook, act } from '@testing-library/react-hooks';
import { useVoice } from '../../../src/logique/hooks/useVoice';
import { VoiceService } from '../../../src/logique/services/VoiceService';

jest.mock('../../../src/logique/services/VoiceService');

describe('useVoice', () => {
  let voice: jest.Mocked<VoiceService>;
  let onResult: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    voice = new VoiceService() as jest.Mocked<VoiceService>;
    onResult = jest.fn();
    voice.requestPermission.mockResolvedValue(true);
    Object.defineProperty(voice, 'isAvailable', { get: () => true });
  });

  it('starts not listening', () => {
    const { result } = renderHook(() => useVoice(voice, onResult, false));

    expect(result.current.isListening).toBe(false);
    expect(result.current.voiceError).toBe('');
  });

  it('returns voiceAvailable true when service is available', () => {
    const { result } = renderHook(() => useVoice(voice, onResult, false));

    expect(result.current.voiceAvailable).toBe(true);
  });

  it('returns voiceAvailable false when voice service is null', () => {
    const { result } = renderHook(() => useVoice(null, onResult, false));

    expect(result.current.voiceAvailable).toBe(false);
  });

  it('starts listening on toggleMic', async () => {
    const { result } = renderHook(() => useVoice(voice, onResult, false));

    await act(async () => {
      await result.current.toggleMic();
    });

    expect(voice.start).toHaveBeenCalled();
    expect(result.current.isListening).toBe(true);
  });

  it('stops listening on second toggleMic', async () => {
    const { result } = renderHook(() => useVoice(voice, onResult, false));

    await act(async () => {
      await result.current.toggleMic();
    });

    await act(async () => {
      await result.current.toggleMic();
    });

    expect(voice.stop).toHaveBeenCalled();
    expect(result.current.isListening).toBe(false);
  });

  it('does not toggle when generation is locked', async () => {
    const { result } = renderHook(() => useVoice(voice, onResult, true));

    await act(async () => {
      await result.current.toggleMic();
    });

    expect(voice.start).not.toHaveBeenCalled();
  });

  it('sets error when permission denied', async () => {
    voice.requestPermission.mockResolvedValue(false);

    const { result } = renderHook(() => useVoice(voice, onResult, false));

    await act(async () => {
      await result.current.toggleMic();
    });

    expect(result.current.voiceError).toContain('Permission');
  });

  it('sets up voice callbacks', () => {
    const { result } = renderHook(() => useVoice(voice, onResult, false));

    act(() => {
      result.current.setupVoiceCallbacks();
    });

    expect(voice.setup).toHaveBeenCalled();
  });

  it('calls onResult when voice result comes', async () => {
    const { result } = renderHook(() => useVoice(voice, onResult, false));

    act(() => {
      result.current.setupVoiceCallbacks();
    });

    const setupCall = voice.setup.mock.calls[0][0];
    setupCall.onResults('Bonjour');

    expect(onResult).toHaveBeenCalledWith('Bonjour');
  });
});
