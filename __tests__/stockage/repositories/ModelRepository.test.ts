import RNFS from 'react-native-fs';
import { ModelRepository } from '../../../src/stockage/repositories/ModelRepository';

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/mock/documents',
  exists: jest.fn(),
  existsAssets: jest.fn(),
  mkdir: jest.fn(),
  copyFileAssets: jest.fn(),
  downloadFile: jest.fn(),
}));

describe('ModelRepository', () => {
  let repo: ModelRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new ModelRepository();
  });

  it('builds correct model directory path', () => {
    expect(repo.modelDir).toBe('/mock/documents/models');
  });

  it('builds correct model file path', () => {
    expect(repo.modelPath).toContain('/mock/documents/models/');
    expect(repo.modelPath).toContain('.gguf');
  });

  it('ensures directory exists', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(false);

    await repo.ensureDir();

    expect(RNFS.mkdir).toHaveBeenCalledWith('/mock/documents/models');
  });

  it('does not create directory if it already exists', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(true);

    await repo.ensureDir();

    expect(RNFS.mkdir).not.toHaveBeenCalled();
  });

  it('checks if model exists', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(true);

    const result = await repo.modelExists();

    expect(result).toBe(true);
    expect(RNFS.exists).toHaveBeenCalled();
  });

  it('checks if asset exists', async () => {
    (RNFS.existsAssets as jest.Mock).mockResolvedValue(true);

    const result = await repo.assetExists();

    expect(result).toBe(true);
  });

  it('copies model from assets', async () => {
    await repo.copyFromAsset();

    expect(RNFS.copyFileAssets).toHaveBeenCalled();
  });

  it('downloads model with progress', async () => {
    const onProgress = jest.fn();
    (RNFS.downloadFile as jest.Mock).mockReturnValue({
      promise: Promise.resolve({ statusCode: 200 }),
    });

    await repo.downloadModel(onProgress);

    expect(RNFS.downloadFile).toHaveBeenCalled();
  });

  it('rejects on download error', async () => {
    const onProgress = jest.fn();
    (RNFS.downloadFile as jest.Mock).mockReturnValue({
      promise: Promise.resolve({ statusCode: 404 }),
    });

    await expect(repo.downloadModel(onProgress)).rejects.toThrow('Échec');
  });
});
