import { TtsService } from '../../../src/logique/services/TtsService';
import Tts from 'react-native-tts';

jest.mock('react-native-tts', () => ({
  setDefaultLanguage: jest.fn(),
  setDefaultRate: jest.fn(),
  speak: jest.fn(),
}));

describe('TtsService', () => {
  let service: TtsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TtsService();
  });

  it('initializes with French language and slow rate', () => {
    service.init();

    expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('fr-FR');
    expect(Tts.setDefaultRate).toHaveBeenCalledWith(0.5);
  });

  it('speaks text', () => {
    service.speak('Bonjour');

    expect(Tts.speak).toHaveBeenCalledWith('Bonjour');
  });

  it('strips HTML tags before speaking', () => {
    service.speak('<p>Hello</p>');

    expect(Tts.speak).toHaveBeenCalledWith('Hello');
  });

  it('does not speak empty text', () => {
    service.speak('');

    expect(Tts.speak).not.toHaveBeenCalled();
  });
});
