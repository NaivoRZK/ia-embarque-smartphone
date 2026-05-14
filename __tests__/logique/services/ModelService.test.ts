import { ModelService } from '../../../src/logique/services/ModelService';
import { LlmService } from '../../../src/logique/services/LlmService';
import { initLlama } from 'llama.rn';
import RNFS from 'react-native-fs';

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/mock/documents',
  exists: jest.fn(),
  existsAssets: jest.fn(),
  mkdir: jest.fn(),
  copyFileAssets: jest.fn(),
  downloadFile: jest.fn(),
}));

jest.mock('llama.rn', () => ({
  initLlama: jest.fn(),
}));

describe('ModelService', () => {
  let llm: LlmService;
  let onStateChange: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    llm = new LlmService();
    onStateChange = jest.fn();
  });

  it('loads model if already on disk', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(true);
    (initLlama as jest.Mock).mockResolvedValue({ completion: jest.fn() });

    const service = new ModelService(llm, onStateChange);
    await service.initialize();

    expect(onStateChange).toHaveBeenCalledWith('ready', 100);
  });

  it('copies from assets if model not on disk', async () => {
    (RNFS.exists as jest.Mock)
      .mockResolvedValueOnce(false)  // ensureDir: dir doesn't exist
      .mockResolvedValueOnce(false); // modelExists: model not on disk
    (RNFS.existsAssets as jest.Mock).mockResolvedValue(true);
    (initLlama as jest.Mock).mockResolvedValue({ completion: jest.fn() });

    const service = new ModelService(llm, onStateChange);
    await service.initialize();

    expect(RNFS.copyFileAssets).toHaveBeenCalled();
    expect(onStateChange).toHaveBeenCalledWith('ready', 100);
  });

  it('downloads model if not on disk and no asset', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(false);
    (RNFS.existsAssets as jest.Mock).mockResolvedValue(false);
    (RNFS.downloadFile as jest.Mock).mockReturnValue({
      promise: Promise.resolve({ statusCode: 200 }),
    });
    (initLlama as jest.Mock).mockResolvedValue({ completion: jest.fn() });

    const service = new ModelService(llm, onStateChange);
    await service.initialize();

    expect(RNFS.downloadFile).toHaveBeenCalled();
    expect(onStateChange).toHaveBeenCalledWith('ready', 100);
  });

  it('reports error on download failure', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(false);
    (RNFS.existsAssets as jest.Mock).mockResolvedValue(false);
    (RNFS.downloadFile as jest.Mock).mockReturnValue({
      promise: Promise.reject(new Error('Network error')),
    });

    const service = new ModelService(llm, onStateChange);
    await service.initialize();

    expect(onStateChange).toHaveBeenCalledWith('error', 0, expect.stringContaining('Network error'));
  });

  it('reports error on init failure', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(true);
    (initLlama as jest.Mock).mockRejectedValue(new Error('Model corrupt'));

    const service = new ModelService(llm, onStateChange);
    await service.initialize();

    expect(onStateChange).toHaveBeenCalledWith('error', 0, expect.stringContaining('Model corrupt'));
  });
});
