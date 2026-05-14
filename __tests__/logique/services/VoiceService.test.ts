import { VoiceService } from '../../../src/logique/services/VoiceService';
import Voice from '@react-native-community/voice';
import { PermissionsAndroid, Platform } from 'react-native';

jest.mock('@react-native-community/voice', () => ({
  onSpeechStart: null,
  onSpeechEnd: null,
  onSpeechResults: null,
  onSpeechPartialResults: null,
  onSpeechError: null,
  start: jest.fn(),
  stop: jest.fn(),
  destroy: jest.fn().mockResolvedValue(undefined),
  removeAllListeners: jest.fn(),
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: { RECORD_AUDIO: 'android.permission.RECORD_AUDIO' },
    RESULTS: { GRANTED: 'granted' },
  },
}));

describe('VoiceService', () => {
  let service: VoiceService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new VoiceService();
  });

  it('sets up callbacks', () => {
    const callbacks = {
      onStart: jest.fn(),
      onEnd: jest.fn(),
      onResults: jest.fn(),
      onPartialResults: jest.fn(),
      onError: jest.fn(),
    };

    service.setup(callbacks);

    expect(Voice.onSpeechStart).toBeDefined();
    expect(Voice.onSpeechEnd).toBeDefined();
    expect(Voice.onSpeechResults).toBeDefined();
  });

  it('starts voice recognition', async () => {
    await service.start();

    expect(Voice.start).toHaveBeenCalledWith('fr-FR', {
      REQUEST_PERMISSIONS_AUTO: false,
    });
  });

  it('stops voice recognition', async () => {
    await service.stop();

    expect(Voice.stop).toHaveBeenCalled();
  });

  it('requests permission on Android', async () => {
    (PermissionsAndroid.request as jest.Mock).mockResolvedValue('granted');

    const result = await service.requestPermission();

    expect(result).toBe(true);
    expect(PermissionsAndroid.request).toHaveBeenCalled();
  });

  it('destroys and removes listeners', async () => {
    await service.destroy();

    expect(Voice.destroy).toHaveBeenCalled();
  });
});
