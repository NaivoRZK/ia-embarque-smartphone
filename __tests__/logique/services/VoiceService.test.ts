import { VoiceService } from '../../../src/logique/services/VoiceService';
import { PermissionsAndroid } from 'react-native';

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: { RECORD_AUDIO: 'android.permission.RECORD_AUDIO' },
    RESULTS: { GRANTED: 'granted' },
  },
  NativeModules: {
    SpeechRecognition: {
      startListening: jest.fn().mockResolvedValue(''),
      stopListening: jest.fn().mockResolvedValue(''),
      destroy: jest.fn().mockResolvedValue(''),
      setRecognitionLanguage: jest.fn().mockResolvedValue(true),
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    },
  },
  TurboModuleRegistry: {
    get: jest.fn().mockReturnValue(null),
  },
  NativeEventEmitter: jest.fn().mockImplementation(() => ({
    addListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
    removeAllListeners: jest.fn(),
  })),
}));

describe('VoiceService', () => {
  let service: VoiceService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new VoiceService();
  });

  it('is available when native module exists', () => {
    expect(service.isAvailable).toBe(true);
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

    const { setRecognitionLanguage } = require('react-native').NativeModules
      .SpeechRecognition;

    expect(setRecognitionLanguage).toHaveBeenCalledWith('fr-FR');
  });

  it('starts voice recognition', async () => {
    await service.start();

    const { startListening } = require('react-native').NativeModules
      .SpeechRecognition;

    expect(startListening).toHaveBeenCalled();
  });

  it('stops voice recognition', async () => {
    await service.stop();

    const { stopListening } = require('react-native').NativeModules
      .SpeechRecognition;

    expect(stopListening).toHaveBeenCalled();
  });

  it('requests permission on Android', async () => {
    (PermissionsAndroid.request as jest.Mock).mockResolvedValue('granted');

    const result = await service.requestPermission();

    expect(result).toBe(true);
    expect(PermissionsAndroid.request).toHaveBeenCalled();
  });

  it('destroys and cleans up listeners', async () => {
    const { destroy } = require('react-native').NativeModules.SpeechRecognition;

    await service.destroy();

    expect(destroy).toHaveBeenCalled();
  });
});
