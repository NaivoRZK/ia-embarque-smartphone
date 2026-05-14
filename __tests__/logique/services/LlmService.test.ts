import { LlmService } from '../../../src/logique/services/LlmService';
import { initLlama } from 'llama.rn';

jest.mock('llama.rn', () => ({
  initLlama: jest.fn(),
}));

describe('LlmService', () => {
  let service: LlmService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LlmService();
  });

  it('starts not ready', () => {
    expect(service.isReady).toBe(false);
  });

  it('becomes ready after init', async () => {
    const mockContext = { completion: jest.fn() };
    (initLlama as jest.Mock).mockResolvedValue(mockContext);
    const onProgress = jest.fn();

    await service.init('/path/to/model.gguf', onProgress);

    expect(service.isReady).toBe(true);
    expect(initLlama).toHaveBeenCalledWith(
      expect.objectContaining({ model: '/path/to/model.gguf' }),
      onProgress,
    );
  });

  it('generates response from messages', async () => {
    const mockCompletion = jest.fn().mockImplementation(async (_params, cb) => {
      cb({ token: 'Hello' });
      cb({ token: ' World' });
    });
    const mockContext = { completion: mockCompletion };
    (initLlama as jest.Mock).mockResolvedValue(mockContext);

    await service.init('/path/to/model.gguf', jest.fn());
    const onToken = jest.fn();

    const result = await service.generate(
      [{ id: '1', text: 'Hi', role: 'user', timestamp: 1 }],
      onToken,
    );

    expect(result).toBe('Hello World');
    expect(onToken).toHaveBeenCalledWith('Hello');
    expect(onToken).toHaveBeenCalledWith('Hello World');
  });

  it('throws error when generating without init', async () => {
    const onToken = jest.fn();

    await expect(
      service.generate(
        [{ id: '1', text: 'Hi', role: 'user', timestamp: 1 }],
        onToken,
      ),
    ).rejects.toThrow('non initialisé');
  });

  it('resets state on dispose', async () => {
    const mockContext = { completion: jest.fn() };
    (initLlama as jest.Mock).mockResolvedValue(mockContext);

    await service.init('/path/to/model.gguf', jest.fn());
    expect(service.isReady).toBe(true);

    service.dispose();
    expect(service.isReady).toBe(false);
  });
});
